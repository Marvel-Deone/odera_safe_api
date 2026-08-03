import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import {
  NinVerificationStatus,
  Prisma,
  ResidentAssociateCategory,
} from '@prisma/client'
import axios from 'axios'
import { firstValueFrom } from 'rxjs'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import {
  CreateResidentAssociateDto,
  UpdateResidentAssociateDto,
} from './dto/resident-associate.dto'

@Injectable()
export class ResidentAssociateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService,
  ) {}

  private qoreIdSecret = process.env.QORE_ID_SECRET_KEY
  private qoreIdClientId = process.env.QORE_ID_CLIENT_ID
  private qoreIdUrl = process.env.QORE_ID_BASE_URL

  private assertValidTimeRange(entryTime: string, exitTime: string) {
    if (entryTime >= exitTime) {
      error('Invalid Time Range', 'Exit time must be after entry time', HttpStatus.BAD_REQUEST)
    }
  }

  private isNin(idType: string) {
    return idType.trim().toUpperCase() === 'NIN'
  }

  private async getResident(userId: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { userId },
    })

    if (!resident) {
      error('Not Found', 'Resident profile not found', HttpStatus.NOT_FOUND)
    }

    return resident!
  }

  private async qoreIdLogin() {
    if (!this.qoreIdUrl || !this.qoreIdClientId || !this.qoreIdSecret) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'error',
          title: 'NIN Verification Not Configured',
          message: 'QoreID environment variables are not configured',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.qoreIdUrl}/token`,
          {
            clientId: this.qoreIdClientId,
            secret: this.qoreIdSecret,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30_000,
          },
        ),
      )

      return response.data.accessToken
    } catch (err) {
      const statusCode = axios.isAxiosError(err)
        ? err.response?.status ?? HttpStatus.BAD_GATEWAY
        : HttpStatus.BAD_GATEWAY

      throw new HttpException(
        {
          statusCode,
          status: 'error',
          title: 'NIN Verification Login Failed',
          message: axios.isAxiosError(err)
            ? err.response?.data?.message ?? err.message
            : 'Unable to authenticate with QoreID',
          data: axios.isAxiosError(err) ? err.response?.data : undefined,
        },
        statusCode,
      )
    }
  }

  private async verifyNin(input: { idNumber: string; photoUrl?: string }) {
    if (!input.photoUrl) {
      return error(
        'Face Capture Required',
        'Face capture is required for NIN verification',
        HttpStatus.BAD_REQUEST,
      )
    }

    const accessToken = await this.qoreIdLogin()

    try {
      const response = await firstValueFrom(
        this.http.post(
          `${this.qoreIdUrl}/v1/ng/identities/face-verification/nin`,
          {
            idNumber: input.idNumber,
            photoUrl: input.photoUrl,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 30_000,
          },
        ),
      )

      const data = response.data

      if (data?.face_verification && !data.face_verification.match) {
        return error(
          'Face Verification Failed',
          'Face verification failed. Please ensure the photo matches the NIN.',
          HttpStatus.BAD_REQUEST,
        )
      }

      return data
    } catch (err) {
      const statusCode = axios.isAxiosError(err)
        ? err.response?.status ?? HttpStatus.BAD_GATEWAY
        : HttpStatus.BAD_GATEWAY

      throw new HttpException(
        {
          statusCode,
          status: 'error',
          title: 'NIN Verification Failed',
          message: axios.isAxiosError(err)
            ? err.response?.data?.message ?? err.message
            : 'Unable to verify NIN',
          data: axios.isAxiosError(err) ? err.response?.data : undefined,
        },
        statusCode,
      )
    }
  }

  async create(userId: string, dto: CreateResidentAssociateDto) {
    this.assertValidTimeRange(dto.entryTime, dto.exitTime)
    const resident = await this.getResident(userId)
    const category = dto.category ?? ResidentAssociateCategory.CO_RESIDENT
    const role = dto.role?.trim() || 'Co-resident'

    const ninVerificationData = this.isNin(dto.idType)
      ? await this.verifyNin({ idNumber: dto.idNumber, photoUrl: dto.faceCapture })
      : null
    const data: Prisma.ResidentAssociateCreateInput = {
      resident: { connect: { id: resident.id } },
      category,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      role,
      idType: dto.idType,
      idNumber: dto.idNumber,
      faceCapture: dto.faceCapture,
      workingDays: dto.workingDays,
      entryTime: dto.entryTime,
      exitTime: dto.exitTime,
      ninVerificationStatus: ninVerificationData
        ? NinVerificationStatus.VERIFIED
        : NinVerificationStatus.NOT_SUBMITTED,
    }

    if (ninVerificationData) {
      data.ninVerificationData = ninVerificationData as Prisma.InputJsonValue
    }

    const associate = await this.prisma.residentAssociate.create({
      data,
    })

    return success(associate, 'Associate Created', 'Resident associate created successfully', HttpStatus.CREATED)
  }

  async findMine(userId: string) {
    const resident = await this.getResident(userId)
    const associates = await this.prisma.residentAssociate.findMany({
      where: { residentId: resident.id },
      orderBy: { createdAt: 'desc' },
    })

    return success(associates, 'Associates Retrieved', 'Resident associates fetched successfully')
  }

  async update(userId: string, associateId: string, dto: UpdateResidentAssociateDto) {
    const resident = await this.getResident(userId)
    const associate = await this.prisma.residentAssociate.findFirst({
      where: { id: associateId, residentId: resident.id },
    })

    if (!associate) {
      return error('Not Found', 'Resident associate not found', HttpStatus.NOT_FOUND)
    }

    const entryTime = dto.entryTime ?? associate.entryTime
    const exitTime = dto.exitTime ?? associate.exitTime
    this.assertValidTimeRange(entryTime, exitTime)

    const idType = dto.idType ?? associate.idType
    const idNumber = dto.idNumber ?? associate.idNumber
    const faceCapture = dto.faceCapture ?? associate.faceCapture ?? undefined
    const shouldVerifyNin =
      this.isNin(idType) &&
      (dto.idType !== undefined || dto.idNumber !== undefined || dto.faceCapture !== undefined)

    const ninVerificationData = shouldVerifyNin
      ? await this.verifyNin({ idNumber, photoUrl: faceCapture })
      : undefined

    const updated = await this.prisma.residentAssociate.update({
      where: { id: associate.id },
      data: {
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
        ...(dto.phoneNumber !== undefined ? { phoneNumber: dto.phoneNumber } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
        ...(dto.idType !== undefined ? { idType: dto.idType } : {}),
        ...(dto.idNumber !== undefined ? { idNumber: dto.idNumber } : {}),
        ...(dto.faceCapture !== undefined ? { faceCapture: dto.faceCapture } : {}),
        ...(dto.workingDays !== undefined ? { workingDays: dto.workingDays } : {}),
        ...(dto.entryTime !== undefined ? { entryTime: dto.entryTime } : {}),
        ...(dto.exitTime !== undefined ? { exitTime: dto.exitTime } : {}),
        ...(ninVerificationData !== undefined
          ? {
              ninVerificationStatus: NinVerificationStatus.VERIFIED,
              ninVerificationData: ninVerificationData as Prisma.InputJsonValue,
            }
          : {}),
      },
    })

    return success(updated, 'Associate Updated', 'Resident associate updated successfully')
  }

  async remove(userId: string, associateId: string) {
    const resident = await this.getResident(userId)
    const associate = await this.prisma.residentAssociate.findFirst({
      where: { id: associateId, residentId: resident.id },
    })

    if (!associate) {
      return error('Not Found', 'Resident associate not found', HttpStatus.NOT_FOUND)
    }

    await this.prisma.residentAssociate.delete({ where: { id: associate.id } })

    return success(null, 'Associate Deleted', 'Resident associate deleted successfully')
  }
}
