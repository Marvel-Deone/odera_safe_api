import { HttpStatus, Injectable } from '@nestjs/common'
import {
  BusinessHubStatus,
  BusinessPaymentFrequency,
  BusinessPaymentStatus,
  BusinessRegistrationStatus,
  LogCategory,
  Prisma,
  Role,
  WalletTransactionStatus,
  WalletTransactionType,
  Weekday,
} from '@prisma/client'
import { randomUUID } from 'crypto'
import * as QRCode from 'qrcode'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import {
  RegisterBusinessDto,
  SuspendBusinessRegistrationDto,
  UpsertBusinessHubSettingsDto,
  VerifyBusinessPassDto,
} from './dto/business-hub.dto'

@Injectable()
export class BusinessHubService {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: Prisma.Decimal | number | string | null | undefined) {
    return value === null || value === undefined ? 0 : Number(value)
  }

  private reference(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  private addBillingPeriod(date: Date, frequency: BusinessPaymentFrequency) {
    const expiresAt = new Date(date)

    if (frequency === BusinessPaymentFrequency.MONTHLY) {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    return expiresAt
  }

  private assertValidTimeRange(startTime: string, endTime: string) {
    if (startTime >= endTime) {
      error('Invalid Time Range', 'End time must be after start time', HttpStatus.BAD_REQUEST)
    }
  }

  private weekdayFor(date: Date): Weekday {
    const days = [
      Weekday.SUNDAY,
      Weekday.MONDAY,
      Weekday.TUESDAY,
      Weekday.WEDNESDAY,
      Weekday.THURSDAY,
      Weekday.FRIDAY,
      Weekday.SATURDAY,
    ]

    return days[date.getDay()]
  }

  private timeFor(date: Date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  private async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { resident: { include: { wallet: true } } },
    })

    if (!user) {
      error('Unauthorized', 'User not found', HttpStatus.NOT_FOUND)
    }

    return user!
  }

  private async getResident(userId: string) {
    const user = await this.getUser(userId)

    if (!user.resident) {
      error('Resident Not Found', 'Resident profile not found', HttpStatus.FORBIDDEN)
    }

    return { user, resident: user.resident! }
  }

  private async getSettings(estateId: string) {
    return this.prisma.businessHubSettings.upsert({
      where: { estateId },
      update: {},
      create: { estateId },
    })
  }

  private async log(
    client: Prisma.TransactionClient | PrismaService,
    data: {
      estateId: string
      action: string
      description: string
      actorId?: string | null
      actorRole?: Role | null
      metadata?: any
    },
  ) {
    return client.activityLog.create({
      data: {
        estateId: data.estateId,
        category: LogCategory.SYSTEM,
        action: data.action,
        description: data.description,
        actorId: data.actorId,
        actorRole: data.actorRole,
        metadata: data.metadata,
      },
    })
  }

  private async generatePass(tx: Prisma.TransactionClient) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const passcode = Math.floor(100000 + Math.random() * 900000).toString()
      const qrPayload = `BUSINESS:${randomUUID()}`
      const existing = await tx.businessRegistration.findFirst({
        where: { OR: [{ passcode }, { qrPayload }] },
        select: { id: true },
      })

      if (!existing) {
        return {
          passcode,
          qrPayload,
          qrCode: await QRCode.toDataURL(qrPayload),
        }
      }
    }

    throw new Error('BUSINESS_PASS_GENERATION_FAILED')
  }

  async upsertSettings(userId: string, dto: UpsertBusinessHubSettingsDto) {
    const admin = await this.getUser(userId)

    const settings = await this.prisma.businessHubSettings.upsert({
      where: { estateId: admin.estateId },
      update: {
        registrationFee: dto.registrationFee,
        paymentFrequency: dto.paymentFrequency,
        maxVehiclesAllowed: dto.maxVehiclesAllowed,
        status: dto.status,
      },
      create: {
        estateId: admin.estateId,
        registrationFee: dto.registrationFee,
        paymentFrequency: dto.paymentFrequency,
        maxVehiclesAllowed: dto.maxVehiclesAllowed,
        status: dto.status,
      },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'BUSINESS_HUB_SETTINGS_UPDATED',
      description: 'Business Hub settings updated',
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { settingsId: settings.id },
    })

    return success(settings, 'Business Hub Settings Updated', 'Business Hub settings saved successfully')
  }

  async getAdminSettings(userId: string) {
    const admin = await this.getUser(userId)
    const settings = await this.getSettings(admin.estateId)

    return success(settings, 'Business Hub Settings', 'Business Hub settings fetched successfully')
  }

  async getResidentSettings(userId: string) {
    const { resident } = await this.getResident(userId)
    const settings = await this.getSettings(resident.estateId)

    return success(settings, 'Business Hub Settings', 'Business Hub settings fetched successfully')
  }

  async registerBusiness(userId: string, dto: RegisterBusinessDto) {
    this.assertValidTimeRange(dto.startTime, dto.endTime)

    const { user, resident } = await this.getResident(userId)
    const settings = await this.getSettings(resident.estateId)

    if (settings.status !== BusinessHubStatus.ENABLED) {
      return error('Business Hub Disabled', 'Business Hub is currently disabled for this estate', HttpStatus.BAD_REQUEST)
    }

    if (dto.category === 'OTHER' && !dto.otherCategory?.trim()) {
      return error('Business Type Required', 'Enter business type when category is Other', HttpStatus.BAD_REQUEST)
    }

    const fee = this.toNumber(settings.registrationFee)

    try {
      const registration = await this.prisma.$transaction(async (tx) => {
        const pass = await this.generatePass(tx)
        const now = new Date()
        const paidAt = dto.payNow ? now : null
        const expiresAt = dto.payNow ? this.addBillingPeriod(now, settings.paymentFrequency) : null

        if (dto.payNow && fee > 0) {
          const wallet =
            resident.wallet ??
            (await tx.wallet.create({ data: { residentId: resident.id } }))

          const latestWallet = await tx.wallet.findUnique({ where: { id: wallet.id } })

          if (!latestWallet || this.toNumber(latestWallet.balance) < fee) {
            throw new Error(`INSUFFICIENT_BALANCE:${fee}`)
          }

          await tx.wallet.update({
            where: { id: latestWallet.id },
            data: { balance: { decrement: fee } },
          })

          await tx.walletTransaction.create({
            data: {
              walletId: latestWallet.id,
              type: WalletTransactionType.BUSINESS_REGISTRATION,
              status: WalletTransactionStatus.SUCCESS,
              amount: fee,
              reference: this.reference('business_registration'),
              description: `Business Hub registration fee for ${dto.category}`,
            },
          })
        }

        const created = await tx.businessRegistration.create({
          data: {
            estateId: resident.estateId,
            residentId: resident.id,
            category: dto.category,
            otherCategory: dto.category === 'OTHER' ? dto.otherCategory?.trim() : null,
            validDays: dto.validDays,
            startTime: dto.startTime,
            endTime: dto.endTime,
            maxVehiclesAllowed: settings.maxVehiclesAllowed,
            registrationFee: fee,
            paymentFrequency: settings.paymentFrequency,
            registrationStatus: dto.payNow
              ? BusinessRegistrationStatus.ACTIVE
              : BusinessRegistrationStatus.PENDING_PAYMENT,
            paymentStatus: dto.payNow ? BusinessPaymentStatus.PAID : BusinessPaymentStatus.UNPAID,
            paidAt,
            expiresAt,
            passcode: pass.passcode,
            qrPayload: pass.qrPayload,
            qrCode: pass.qrCode,
          },
        })

        await tx.businessPayment.create({
          data: {
            registrationId: created.id,
            amount: fee,
            status: dto.payNow ? BusinessPaymentStatus.PAID : BusinessPaymentStatus.UNPAID,
            reference: this.reference('business_payment'),
            paidAt,
          },
        })

        await this.log(tx, {
          estateId: resident.estateId,
          action: dto.payNow ? 'BUSINESS_REGISTERED_ACTIVE' : 'BUSINESS_REGISTERED_PENDING_PAYMENT',
          description: `Resident registered a business under ${dto.category}`,
          actorId: user.id,
          actorRole: user.role,
          metadata: { registrationId: created.id, residentId: resident.id, fee },
        })

        return created
      })

      return success(registration, 'Business Registered', 'Business registration saved successfully', HttpStatus.CREATED)
    } catch (err: any) {
      if (String(err.message).startsWith('INSUFFICIENT_BALANCE')) {
        return error(
          'Insufficient Balance',
          'Wallet balance is too low for Business Hub registration fee. Please fund wallet or choose pay later.',
          HttpStatus.BAD_REQUEST,
        )
      }

      throw err
    }
  }

  async payRegistration(userId: string, registrationId: string) {
    const { user, resident } = await this.getResident(userId)
    const registration = await this.prisma.businessRegistration.findFirst({
      where: { id: registrationId, residentId: resident.id },
      include: { resident: { include: { wallet: true } } },
    })

    if (!registration) {
      return error('Not Found', 'Business registration not found', HttpStatus.NOT_FOUND)
    }

    if (registration.registrationStatus === BusinessRegistrationStatus.SUSPENDED) {
      return error('Suspended', 'Business registration is suspended', HttpStatus.BAD_REQUEST)
    }

    if (registration.paymentStatus === BusinessPaymentStatus.PAID && registration.registrationStatus === BusinessRegistrationStatus.ACTIVE) {
      return success(registration, 'Already Paid', 'Business registration is already active')
    }

    const fee = this.toNumber(registration.registrationFee)

    try {
      const updated = await this.prisma.$transaction(async (tx) => {
        if (fee > 0) {
          const wallet =
            registration.resident.wallet ??
            (await tx.wallet.create({ data: { residentId: resident.id } }))

          const latestWallet = await tx.wallet.findUnique({ where: { id: wallet.id } })

          if (!latestWallet || this.toNumber(latestWallet.balance) < fee) {
            await tx.businessPayment.create({
              data: {
                registrationId: registration.id,
                amount: fee,
                status: BusinessPaymentStatus.FAILED,
                reference: this.reference('business_payment_failed'),
              },
            })
            throw new Error(`INSUFFICIENT_BALANCE:${fee}`)
          }

          await tx.wallet.update({
            where: { id: latestWallet.id },
            data: { balance: { decrement: fee } },
          })

          await tx.walletTransaction.create({
            data: {
              walletId: latestWallet.id,
              type: WalletTransactionType.BUSINESS_REGISTRATION,
              status: WalletTransactionStatus.SUCCESS,
              amount: fee,
              reference: this.reference('business_registration'),
              description: `Business Hub registration payment for ${registration.category}`,
            },
          })
        }

        const paidAt = new Date()
        const expiresAt = this.addBillingPeriod(paidAt, registration.paymentFrequency)

        await tx.businessPayment.create({
          data: {
            registrationId: registration.id,
            amount: fee,
            status: BusinessPaymentStatus.PAID,
            reference: this.reference('business_payment'),
            paidAt,
          },
        })

        const active = await tx.businessRegistration.update({
          where: { id: registration.id },
          data: {
            registrationStatus: BusinessRegistrationStatus.ACTIVE,
            paymentStatus: BusinessPaymentStatus.PAID,
            paidAt,
            expiresAt,
          },
        })

        await this.log(tx, {
          estateId: resident.estateId,
          action: 'BUSINESS_REGISTRATION_PAYMENT_SUCCESS',
          description: 'Business Hub registration payment completed',
          actorId: user.id,
          actorRole: user.role,
          metadata: { registrationId: registration.id, fee },
        })

        return active
      })

      return success(updated, 'Payment Successful', 'Business registration activated successfully')
    } catch (err: any) {
      if (String(err.message).startsWith('INSUFFICIENT_BALANCE')) {
        return error(
          'Insufficient Balance',
          'Wallet balance is too low for Business Hub registration fee.',
          HttpStatus.BAD_REQUEST,
        )
      }

      throw err
    }
  }

  async getResidentRegistrations(userId: string) {
    const { resident } = await this.getResident(userId)
    const registrations = await this.prisma.businessRegistration.findMany({
      where: { residentId: resident.id },
      include: { payments: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    })

    return success(registrations, 'Business Registrations', 'Business registrations fetched successfully')
  }

  async getRegistrationPass(userId: string, registrationId: string) {
    const { resident } = await this.getResident(userId)
    const registration = await this.prisma.businessRegistration.findFirst({
      where: { id: registrationId, residentId: resident.id },
      select: {
        id: true,
        registrationStatus: true,
        paymentStatus: true,
        passcode: true,
        qrPayload: true,
        qrCode: true,
        validDays: true,
        startTime: true,
        endTime: true,
        maxVehiclesAllowed: true,
        expiresAt: true,
      },
    })

    if (!registration) {
      return error('Not Found', 'Business registration not found', HttpStatus.NOT_FOUND)
    }

    return success(registration, 'Business Pass', 'Business pass fetched successfully')
  }

  async getEstateRegistrations(userId: string) {
    const admin = await this.getUser(userId)
    const registrations = await this.prisma.businessRegistration.findMany({
      where: { estateId: admin.estateId },
      include: {
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true },
        },
        payments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(registrations, 'Business Registrations', 'Estate business registrations fetched successfully')
  }

  async suspendRegistration(userId: string, registrationId: string, dto: SuspendBusinessRegistrationDto) {
    const admin = await this.getUser(userId)
    const registration = await this.prisma.businessRegistration.findFirst({
      where: { id: registrationId, estateId: admin.estateId },
    })

    if (!registration) {
      return error('Not Found', 'Business registration not found', HttpStatus.NOT_FOUND)
    }

    const updated = await this.prisma.businessRegistration.update({
      where: { id: registration.id },
      data: {
        registrationStatus: BusinessRegistrationStatus.SUSPENDED,
        suspendedAt: new Date(),
        suspensionReason: dto.reason,
      },
    })

    return success(updated, 'Business Registration Suspended', 'Business registration suspended successfully')
  }

  async activateRegistration(userId: string, registrationId: string) {
    const admin = await this.getUser(userId)
    const registration = await this.prisma.businessRegistration.findFirst({
      where: { id: registrationId, estateId: admin.estateId },
    })

    if (!registration) {
      return error('Not Found', 'Business registration not found', HttpStatus.NOT_FOUND)
    }

    if (registration.paymentStatus !== BusinessPaymentStatus.PAID || !registration.expiresAt || registration.expiresAt <= new Date()) {
      return error('Cannot Activate', 'Business registration must be paid and unexpired', HttpStatus.BAD_REQUEST)
    }

    const updated = await this.prisma.businessRegistration.update({
      where: { id: registration.id },
      data: {
        registrationStatus: BusinessRegistrationStatus.ACTIVE,
        suspendedAt: null,
        suspensionReason: null,
      },
    })

    return success(updated, 'Business Registration Activated', 'Business registration activated successfully')
  }

  async verifyPass(userId: string, dto: VerifyBusinessPassDto) {
    const guard = await this.getUser(userId)

    if (!dto.passcode && !dto.qrPayload) {
      return error('Invalid Payload', 'Passcode or QR payload is required', HttpStatus.BAD_REQUEST)
    }

    const registration = await this.prisma.businessRegistration.findFirst({
      where: {
        OR: [
          ...(dto.passcode ? [{ passcode: dto.passcode }] : []),
          ...(dto.qrPayload ? [{ qrPayload: dto.qrPayload }] : []),
        ],
      },
      include: {
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true },
        },
      },
    })

    const deny = async (reason: string, registrationId?: string | null, estateId?: string) => {
      await this.prisma.businessAccessLog.create({
        data: {
          registrationId,
          passcode: dto.passcode,
          qrPayload: dto.qrPayload,
          gateName: dto.gateName,
          vehiclePlate: dto.vehiclePlate,
          verifiedById: guard.id,
          allowed: false,
          deniedReason: reason,
        },
      })

      return success({ allowed: false, reason }, 'Access Denied', reason)
    }

    if (!registration) {
      return deny('Business pass not found')
    }

    if (registration.estateId !== guard.estateId) {
      return deny('Business pass does not belong to this estate', registration.id, registration.estateId)
    }

    if (registration.registrationStatus !== BusinessRegistrationStatus.ACTIVE) {
      return deny(`Business registration is ${registration.registrationStatus.toLowerCase()}`, registration.id, registration.estateId)
    }

    if (registration.paymentStatus !== BusinessPaymentStatus.PAID) {
      return deny('Business registration payment is unpaid', registration.id, registration.estateId)
    }

    const now = new Date()

    if (!registration.expiresAt || registration.expiresAt <= now) {
      await this.prisma.businessRegistration.update({
        where: { id: registration.id },
        data: {
          registrationStatus: BusinessRegistrationStatus.EXPIRED,
          paymentStatus: BusinessPaymentStatus.EXPIRED,
        },
      })
      return deny('Business registration has expired', registration.id, registration.estateId)
    }

    if (!registration.validDays.includes(this.weekdayFor(now))) {
      return deny('Business pass is not valid today', registration.id, registration.estateId)
    }

    const currentTime = this.timeFor(now)
    if (currentTime < registration.startTime || currentTime > registration.endTime) {
      return deny('Business pass is outside its valid time window', registration.id, registration.estateId)
    }

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(now)
    todayEnd.setHours(23, 59, 59, 999)

    const allowedLogs = await this.prisma.businessAccessLog.findMany({
      where: {
        registrationId: registration.id,
        allowed: true,
        createdAt: { gte: todayStart, lte: todayEnd },
      },
      select: { vehiclePlate: true },
    })

    if (dto.vehiclePlate) {
      const uniquePlates = new Set(allowedLogs.map((log) => log.vehiclePlate).filter(Boolean))

      if (!uniquePlates.has(dto.vehiclePlate) && uniquePlates.size >= registration.maxVehiclesAllowed) {
        return deny('Business vehicle limit reached', registration.id, registration.estateId)
      }
    } else if (allowedLogs.length >= registration.maxVehiclesAllowed) {
      return deny('Business vehicle limit reached', registration.id, registration.estateId)
    }

    const accessLog = await this.prisma.businessAccessLog.create({
      data: {
        registrationId: registration.id,
        passcode: dto.passcode,
        qrPayload: dto.qrPayload,
        gateName: dto.gateName,
        vehiclePlate: dto.vehiclePlate,
        verifiedById: guard.id,
        allowed: true,
      },
    })

    return success(
      { allowed: true, registration, resident: registration.resident, accessLog },
      'Access Granted',
      'Business pass access granted',
    )
  }
}
