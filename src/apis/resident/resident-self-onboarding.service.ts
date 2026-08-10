import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { KycStatus, LogCategory, ResidentSelfOnboardingStatus, ResidentStatus, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { error, success } from '../../common/utils/response.util'
import { formatPhoneNumber } from '../../common/utils/phone.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ResidentSelfOnboardingDto } from './dto/resident.dto'
import { ResidentWhatsappService } from './resident-whatsapp.service'
import { EmailService } from '../../shared/email.service'

@Injectable()
export class ResidentSelfOnboardingService {
  private readonly logger = new Logger(ResidentSelfOnboardingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappService: ResidentWhatsappService,
    private readonly emailService: EmailService,
  ) { }

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

    const existing = await this.prisma.resident.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: whatsappPhone },
        ],
      },
    })

    const duplicateStatuses: ResidentSelfOnboardingStatus[] = [
      ResidentSelfOnboardingStatus.PENDING,
      ResidentSelfOnboardingStatus.ACTIVATED,
    ]

    // if (existing && duplicateStatuses.includes(existing.status)) {
    if (existing) {
      return error(
        'Duplicate Onboarding',
        'An onboarding request already exists for this WhatsApp phone number or email. Please check your WhatsApp messages or email for the activation code.',
        HttpStatus.BAD_REQUEST,
      )
    }

    const activationCode = this.generateActivationCode()
    const tempPassword =
      Math.random().toString(36).slice(-8)

    const hashedPassword = await bcrypt.hash(tempPassword, 10)
    const activationCodeHash = await bcrypt.hash(activationCode, 10)
    const activationCodeExpiresAt = this.activationExpiry()
    const appDownloadLink = process.env.APP_DOWNLOAD_LINK ?? 'https://oderasafe.ddsafe.tech'

    // const whatsappDelivery = await this.whatsappService.sendOnboardingActivationMessage({
    //   whatsappPhone,
    //   houseNumber: dto.houseNumber,
    //   activationCode,
    //   appDownloadLink,
    // })

    // const onboarding = await this.prisma.$transaction(async (tx) => {
    //   const record = existing
    //     ? await tx.residentSelfOnboarding.update({
    //       where: { id: existing.id },
    //       data: {
    //         estateId: estate.id,
    //         fullName: dto.fullName,
    //         houseNumber: dto.houseNumber,
    //         residentAddress: dto.residentAddress,
    //         whatsappPhone,
    //         activationCodeHash,
    //         activationCodeExpiresAt,
    //         activatedAt: null,
    //         status: ResidentSelfOnboardingStatus.PENDING,
    //       },
    //     })
    //     : await tx.residentSelfOnboarding.create({
    //       data: {
    //         estateId: estate.id,
    //         fullName: dto.fullName,
    //         houseNumber: dto.houseNumber,
    //         residentAddress: dto.residentAddress,
    //         whatsappPhone,
    //         email: dto.email,
    //         activationCodeHash,
    //         activationCodeExpiresAt,
    //         status: ResidentSelfOnboardingStatus.PENDING,
    //       },
    //     })

    //   await tx.activityLog.create({
    //     data: {
    //       estateId: estate.id,
    //       category: LogCategory.SYSTEM,
    //       action: 'RESIDENT_SELF_ONBOARDING_CREATED',
    //       description: `Resident self-onboarding created for ${dto.fullName} at house ${dto.houseNumber}`,
    //       actorId: null,
    //       actorRole: null,
    //       metadata: {
    //         onboardingId: record.id,
    //         fullName: dto.fullName,
    //         houseNumber: dto.houseNumber,
    //         whatsappPhone,
    //         email: dto.email,
    //       },
    //     },
    //   })

    //   return record
    // }) 

    const onboarding = await this.prisma.$transaction(async (tx) => {
      const user =
        await tx.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            role: Role.RESIDENT,
            first_login: true,
            estateId: estate.id,
          },
        })
      const record = await tx.resident.create({
          data: {
            first_name: dto.first_name,
            last_name: dto.last_name,
            estateId: estate.id,
            userId: user.id,
            house_no: dto.houseNumber,
            // home_address: dto.residentAddress,
            block: dto.block,
            streetId: dto.streetId,
            phone: whatsappPhone,
            email: dto.email,
            activationCodeExpiresAt,
            status: ResidentStatus.PENDING,
            kycStatus: KycStatus.NOT_SUBMITTED,
          },
        })

      await tx.activityLog.create({
        data: {
          estateId: estate.id,
          category: LogCategory.SYSTEM,
          action: 'RESIDENT_SELF_ONBOARDING_CREATED',
          description: `Resident self-onboarding created for ${dto.first_name} ${dto.last_name} at house ${dto.houseNumber}`,
          actorId: null,
          actorRole: null,
          metadata: {
            onboardingId: record.id,
            fullName: `${dto.first_name} ${dto.last_name}`,
            houseNumber: dto.houseNumber,
            whatsappPhone,
            email: dto.email,
          },
        },
      })

      return record
    })

    const emailDelivery = await this.emailService.sendOnboardingActivationEmail({
      toEmail: dto.email,
      fullName: `${dto.first_name} ${dto.last_name}`,
      houseNumber: dto.houseNumber,
      activationCode: tempPassword,
      appDownloadLink,
    })

    return success(
      {
        onboarding: {
          id: onboarding.id,
          fullName: `${onboarding.first_name} ${onboarding.last_name}`,
          houseNumber: onboarding.house_no,
          residentAddress: onboarding.home_address,
          whatsappPhone: onboarding.phone,
          status: onboarding.status,
          activationCodeExpiresAt: onboarding.activationCodeExpiresAt,
          createdAt: onboarding.createdAt,
        },
        // whatsappDelivery,
        emailDelivery,
      },
      'Onboarding Successful',
      'Resident onboarding completed and activation message sent',
      HttpStatus.CREATED,
    )
  }
}
