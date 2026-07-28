import { HttpStatus, Injectable } from '@nestjs/common'
import { LogCategory, ResidentSelfOnboardingStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { error, success } from '../../common/utils/response.util'
import { formatPhoneNumber } from '../../common/utils/phone.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ResidentSelfOnboardingDto } from './dto/resident.dto'
import { ResidentWhatsappService } from './resident-whatsapp.service'

@Injectable()
export class ResidentSelfOnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: ResidentWhatsappService,
  ) {}

  private generateActivationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private activationExpiry() {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    return expiresAt
  }

  async register(dto: ResidentSelfOnboardingDto) {
    const estate = await this.prisma.estate.findFirst()

    if (!estate) {
      return error('Not Found', 'Estate not found', HttpStatus.NOT_FOUND)
    }

    const whatsappPhone = formatPhoneNumber(dto.whatsappPhone)

    const existing = await this.prisma.residentSelfOnboarding.findUnique({
      where: { whatsappPhone },
    })

    const duplicateStatuses: ResidentSelfOnboardingStatus[] = [
      ResidentSelfOnboardingStatus.PENDING,
      ResidentSelfOnboardingStatus.ACTIVATED,
    ]

    if (existing && duplicateStatuses.includes(existing.status)) {
      return error(
        'Duplicate Onboarding',
        'An onboarding request already exists for this WhatsApp phone number',
        HttpStatus.BAD_REQUEST,
      )
    }

    const activationCode = this.generateActivationCode()
    const activationCodeHash = await bcrypt.hash(activationCode, 10)
    const activationCodeExpiresAt = this.activationExpiry()
    const appDownloadLink = process.env.APP_DOWNLOAD_LINK ?? 'https://odera-safe.vercel.app'

    const whatsappDelivery = await this.whatsappService.sendOnboardingActivationMessage({
      whatsappPhone,
      houseNumber: dto.houseNumber,
      activationCode,
      appDownloadLink,
    })

    const onboarding = await this.prisma.$transaction(async (tx) => {
      const record = existing
        ? await tx.residentSelfOnboarding.update({
            where: { id: existing.id },
            data: {
              estateId: estate.id,
              fullName: dto.fullName,
              houseNumber: dto.houseNumber,
              residentAddress: dto.residentAddress,
              whatsappPhone,
              activationCodeHash,
              activationCodeExpiresAt,
              activatedAt: null,
              status: ResidentSelfOnboardingStatus.PENDING,
            },
          })
        : await tx.residentSelfOnboarding.create({
            data: {
              estateId: estate.id,
              fullName: dto.fullName,
              houseNumber: dto.houseNumber,
              residentAddress: dto.residentAddress,
              whatsappPhone,
              activationCodeHash,
              activationCodeExpiresAt,
              status: ResidentSelfOnboardingStatus.PENDING,
            },
          })

      await tx.activityLog.create({
        data: {
          estateId: estate.id,
          category: LogCategory.SYSTEM,
          action: 'RESIDENT_SELF_ONBOARDING_CREATED',
          description: `Resident self-onboarding created for ${dto.fullName} at house ${dto.houseNumber}`,
          actorId: null,
          actorRole: null,
          metadata: {
            onboardingId: record.id,
            fullName: dto.fullName,
            houseNumber: dto.houseNumber,
            whatsappPhone,
          },
        },
      })

      return record
    })

    return success(
      {
        onboarding: {
          id: onboarding.id,
          fullName: onboarding.fullName,
          houseNumber: onboarding.houseNumber,
          residentAddress: onboarding.residentAddress,
          whatsappPhone: onboarding.whatsappPhone,
          status: onboarding.status,
          activationCodeExpiresAt: onboarding.activationCodeExpiresAt,
          createdAt: onboarding.createdAt,
        },
        whatsappDelivery,
      },
      'Onboarding Successful',
      'Resident onboarding completed and activation message sent',
      HttpStatus.CREATED,
    )
  }
}
