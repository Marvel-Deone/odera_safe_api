import { HttpStatus, Injectable } from '@nestjs/common'
import {
  AccessType,
  BookingStatus,
  LogCategory,
  PaymentStatus,
  Prisma,
  Role,
  ShortletStatus,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@prisma/client'
import * as QRCode from 'qrcode'
import { randomUUID } from 'crypto'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import {
  CreateShortletBookingDto,
  CreateShortletPropertyDto,
  UpdateShortletPropertyDto,
  UpsertShortletSettingsDto,
  VerifyShortletAccessDto,
} from './dto/shortlet.dto'
import { ShortletSmsService } from './shortlet-sms.service'

@Injectable()
export class ShortletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shortletSmsService: ShortletSmsService,
  ) {}

  private reference(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  private toNumber(value: Prisma.Decimal | number | string | null | undefined) {
    return value === null || value === undefined ? 0 : Number(value)
  }

  private addOneYear(date: Date) {
    const expiresAt = new Date(date)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    return expiresAt
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

  private async getShortletFee(tx: Prisma.TransactionClient, estateId: string) {
    const settings = await tx.shortletSettings.upsert({
      where: { estateId },
      update: {},
      create: { estateId },
    })

    return this.toNumber(settings.annualRegistrationFee)
  }

  async registerProperty(userId: string, dto: CreateShortletPropertyDto) {
    const { user, resident } = await this.getResident(userId)

    if (!dto.regulationsAccepted) {
      return error(
        'Regulations Required',
        'Estate regulations must be accepted before shortlet registration',
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      const property = await this.prisma.$transaction(async (tx) => {
        const fee = await this.getShortletFee(tx, resident.estateId)
        const wallet =
          resident.wallet ??
          (await tx.wallet.create({ data: { residentId: resident.id } }))

        const latestWallet = await tx.wallet.findUnique({ where: { id: wallet.id } })

        if (!latestWallet || this.toNumber(latestWallet.balance) < fee) {
          throw new Error(`INSUFFICIENT_BALANCE:${fee}`)
        }

        if (fee > 0) {
          await tx.wallet.update({
            where: { id: latestWallet.id },
            data: { balance: { decrement: fee } },
          })

          await tx.walletTransaction.create({
            data: {
              walletId: latestWallet.id,
              type: WalletTransactionType.SHORTLET_REGISTRATION,
              status: WalletTransactionStatus.SUCCESS,
              amount: fee,
              reference: this.reference('shortlet_registration'),
              description: `Annual shortlet registration fee for ${dto.listingUrl}`,
            },
          })
        }

        const paidAt = new Date()
        const expiresAt = this.addOneYear(paidAt)

        const created = await tx.shortletProperty.create({
          data: {
            residentId: resident.id,
            platform: dto.platform,
            listingUrl: dto.listingUrl,
            bedrooms: dto.bedrooms,
            maxGuests: dto.maxGuests,
            annualFeePaid: true,
            annualFeeAmount: fee,
            annualFeeExpiresAt: expiresAt,
            paidAt,
            expiresAt,
            paymentStatus: PaymentStatus.PAID,
            regulationsAccepted: true,
            status: ShortletStatus.ACTIVE,
          },
        })

        await this.log(tx, {
          estateId: resident.estateId,
          action: 'SHORTLET_PROPERTY_REGISTERED',
          description: `Resident registered shortlet property ${created.listingUrl}`,
          actorId: user.id,
          actorRole: Role.RESIDENT,
          metadata: { propertyId: created.id, residentId: resident.id, fee },
        })

        await this.log(tx, {
          estateId: resident.estateId,
          action: 'SHORTLET_PROPERTY_PAYMENT_SUCCESS',
          description: 'Shortlet property annual registration payment completed',
          actorId: user.id,
          actorRole: Role.RESIDENT,
          metadata: { propertyId: created.id, residentId: resident.id, fee },
        })

        return created
      })

      return success(property, 'Shortlet Property Registered', 'Shortlet property registered and activated')
    } catch (err: any) {
      if (String(err.message).startsWith('INSUFFICIENT_BALANCE')) {
        const fee = Number(String(err.message).split(':')[1] ?? 0)
        await this.log(this.prisma, {
          estateId: resident.estateId,
          action: 'SHORTLET_PROPERTY_PAYMENT_FAILED',
          description: 'Shortlet property registration failed due to insufficient wallet balance',
          actorId: user.id,
          actorRole: Role.RESIDENT,
          metadata: { residentId: resident.id, fee },
        })

        return error(
          'Insufficient Balance',
          'Wallet balance is too low for annual shortlet registration fee. Please fund wallet.',
          HttpStatus.BAD_REQUEST,
        )
      }

      throw err
    }
  }

  async getResidentProperties(userId: string) {
    const { resident } = await this.getResident(userId)
    const properties = await this.prisma.shortletProperty.findMany({
      where: { residentId: resident.id },
      include: { bookings: { orderBy: { createdAt: 'desc' }, take: 5 } },
      orderBy: { createdAt: 'desc' },
    })

    return success(properties, 'Shortlet Properties', 'Shortlet properties fetched successfully')
  }

  async updateProperty(userId: string, dto: UpdateShortletPropertyDto) {
    const { resident } = await this.getResident(userId)
    const property = await this.prisma.shortletProperty.findFirst({
      where: { residentId: resident.id },
      orderBy: { createdAt: 'desc' },
    })

    if (!property) {
      return error('Not Found', 'Shortlet property not found', HttpStatus.NOT_FOUND)
    }

    if (dto.regulationsAccepted === false) {
      return error('Regulations Required', 'Estate regulations must remain accepted', HttpStatus.BAD_REQUEST)
    }

    const updated = await this.prisma.shortletProperty.update({
      where: { id: property.id },
      data: {
        ...(dto.platform !== undefined ? { platform: dto.platform } : {}),
        ...(dto.listingUrl !== undefined ? { listingUrl: dto.listingUrl } : {}),
        ...(dto.bedrooms !== undefined ? { bedrooms: dto.bedrooms } : {}),
        ...(dto.maxGuests !== undefined ? { maxGuests: dto.maxGuests } : {}),
        ...(dto.regulationsAccepted !== undefined
          ? { regulationsAccepted: dto.regulationsAccepted }
          : {}),
      },
    })

    return success(updated, 'Shortlet Property Updated', 'Shortlet property updated successfully')
  }

  private validateActiveProperty(property: {
    status: ShortletStatus
    paymentStatus: PaymentStatus
    annualFeePaid: boolean
    expiresAt: Date | null
    annualFeeExpiresAt: Date | null
  }) {
    const expiresAt = property.expiresAt ?? property.annualFeeExpiresAt

    if (property.status !== ShortletStatus.ACTIVE) {
      return `Property is ${property.status.toLowerCase()}`
    }

    if (!property.annualFeePaid || property.paymentStatus !== PaymentStatus.PAID) {
      return 'Property registration fee has not been paid'
    }

    if (!expiresAt || expiresAt <= new Date()) {
      return 'Property registration has expired'
    }

    return null
  }

  private async generateUniqueSmsCode(tx: Prisma.TransactionClient) {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const existing = await tx.shortletBooking.findUnique({ where: { smsCode: code } })

      if (!existing) {
        return code
      }
    }

    throw new Error('SMS_CODE_GENERATION_FAILED')
  }

  async createBooking(userId: string, dto: CreateShortletBookingDto) {
    const { user, resident } = await this.getResident(userId)

    const property = await this.prisma.shortletProperty.findFirst({
      where: { id: dto.propertyId, residentId: resident.id },
      include: { resident: { include: { estate: true } } },
    })

    if (!property) {
      return error('Not Found', 'Shortlet property not found', HttpStatus.NOT_FOUND)
    }

    const propertyError = this.validateActiveProperty(property)
    if (propertyError) {
      return error('Invalid Property', propertyError, HttpStatus.BAD_REQUEST)
    }

    if (dto.guestCount > property.maxGuests) {
      return error('Guest Limit Exceeded', 'Guest count cannot exceed property maximum guests', HttpStatus.BAD_REQUEST)
    }

    const checkInDate = new Date(dto.checkInDate)
    const checkOutDate = new Date(dto.checkOutDate)

    if (checkOutDate <= checkInDate) {
      return error('Invalid Dates', 'Check-out date must be after check-in date', HttpStatus.BAD_REQUEST)
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const smsCode = await this.generateUniqueSmsCode(tx)
      const qrPayload = `SHORTLET:${randomUUID()}`
      const qrCode = await QRCode.toDataURL(qrPayload)

      const booking = await tx.shortletBooking.create({
        data: {
          propertyId: property.id,
          guestName: dto.guestName,
          guestPhone: dto.guestPhone,
          nationality: dto.nationality,
          platform: dto.platform,
          guestCount: dto.guestCount,
          checkInDate,
          checkOutDate,
          qrCode,
          qrPayload,
          smsCode,
          biometricRequired: dto.biometricRequired ?? false,
          status: BookingStatus.ACTIVE,
        },
        include: { property: true },
      })

      await this.log(tx, {
        estateId: resident.estateId,
        action: 'SHORTLET_BOOKING_CREATED',
        description: `Shortlet booking created for ${booking.guestName}`,
        actorId: user.id,
        actorRole: Role.RESIDENT,
        metadata: { bookingId: booking.id, propertyId: property.id },
      })

      await this.log(tx, {
        estateId: resident.estateId,
        action: 'SHORTLET_QR_GENERATED',
        description: `Shortlet QR pass generated for ${booking.guestName}`,
        actorId: null,
        actorRole: null,
        metadata: { bookingId: booking.id, propertyId: property.id },
      })

      return booking
    })

    const sms = await this.shortletSmsService.sendGuestPass({
      phone: result.guestPhone,
      guestName: result.guestName,
      checkInDate: result.checkInDate,
      checkOutDate: result.checkOutDate,
      smsCode: result.smsCode,
      estateName: property.resident.estate.name,
    })

    await this.log(this.prisma, {
      estateId: resident.estateId,
      action: 'SHORTLET_SMS_SENT',
      description: `Shortlet SMS pass prepared for ${result.guestName}`,
      actorId: null,
      actorRole: null,
      metadata: { bookingId: result.id, phone: result.guestPhone, provider: sms.provider, sent: sms.sent },
    })

    return success({ booking: result, sms }, 'Shortlet Booking Created', 'Guest pass generated successfully')
  }

  async getBookings(userId: string) {
    const { resident } = await this.getResident(userId)
    const bookings = await this.prisma.shortletBooking.findMany({
      where: { property: { residentId: resident.id } },
      include: { property: true, logs: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    })

    return success(bookings, 'Shortlet Bookings', 'Shortlet bookings fetched successfully')
  }

  async getBooking(userId: string, bookingId: string) {
    const { resident } = await this.getResident(userId)
    const booking = await this.prisma.shortletBooking.findFirst({
      where: { id: bookingId, property: { residentId: resident.id } },
      include: { property: true, logs: { orderBy: { createdAt: 'desc' } } },
    })

    if (!booking) {
      return error('Not Found', 'Shortlet booking not found', HttpStatus.NOT_FOUND)
    }

    return success(booking, 'Shortlet Booking', 'Shortlet booking fetched successfully')
  }

  async getPass(userId: string, bookingId: string) {
    const { resident } = await this.getResident(userId)
    const booking = await this.prisma.shortletBooking.findFirst({
      where: { id: bookingId, property: { residentId: resident.id } },
      select: {
        id: true,
        guestName: true,
        guestPhone: true,
        checkInDate: true,
        checkOutDate: true,
        qrCode: true,
        qrPayload: true,
        smsCode: true,
        status: true,
      },
    })

    if (!booking) {
      return error('Not Found', 'Shortlet booking not found', HttpStatus.NOT_FOUND)
    }

    return success(booking, 'Shortlet Pass', 'Shortlet pass fetched successfully')
  }

  async verifyAccess(userId: string, dto: VerifyShortletAccessDto) {
    const guard = await this.getUser(userId)

    if (!dto.qrPayload && !dto.smsCode) {
      return error('Invalid Payload', 'QR payload or SMS code is required', HttpStatus.BAD_REQUEST)
    }

    const booking = await this.prisma.shortletBooking.findFirst({
      where: {
        OR: [
          ...(dto.qrPayload ? [{ qrPayload: dto.qrPayload }] : []),
          ...(dto.smsCode ? [{ smsCode: dto.smsCode }] : []),
        ],
      },
      include: {
        property: {
          include: {
            resident: {
              include: { estate: true },
            },
          },
        },
      },
    })

    const deny = async (reason: string, bookingId?: string | null, estateId?: string) => {
      await this.prisma.shortletAccessLog.create({
        data: {
          bookingId,
          type: dto.type,
          gateName: dto.gateName,
          verifiedById: guard.id,
          deniedReason: reason,
          allowed: false,
        },
      })

      await this.log(this.prisma, {
        estateId: estateId ?? guard.estateId,
        action: 'SHORTLET_ACCESS_DENIED',
        description: `Shortlet access denied at ${dto.gateName}: ${reason}`,
        actorId: guard.id,
        actorRole: guard.role,
        metadata: { bookingId, gateName: dto.gateName, type: dto.type, reason },
      })

      return success({ allowed: false, reason }, 'Access Denied', reason)
    }

    if (!booking) {
      return deny('Booking not found')
    }

    const estateId = booking.property.resident.estateId

    if (estateId !== guard.estateId) {
      return deny('Booking does not belong to this estate', booking.id, estateId)
    }

    const validAccessStatuses: BookingStatus[] = [
      BookingStatus.ACTIVE,
      BookingStatus.CHECKED_IN,
    ]

    if (!validAccessStatuses.includes(booking.status)) {
      return deny(`Booking is ${booking.status.toLowerCase()}`, booking.id, estateId)
    }

    const propertyError = this.validateActiveProperty(booking.property)
    if (propertyError) {
      return deny(propertyError, booking.id, estateId)
    }

    if (booking.guestCount > booking.property.maxGuests) {
      return deny('Guest count exceeds property maximum guests', booking.id, estateId)
    }

    const now = new Date()
    if (now < booking.checkInDate || now > booking.checkOutDate) {
      return deny('Booking is outside its valid access period', booking.id, estateId)
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const accessLog = await tx.shortletAccessLog.create({
        data: {
          bookingId: booking.id,
          type: dto.type,
          gateName: dto.gateName,
          verifiedById: guard.id,
          allowed: true,
        },
      })

      const updatedBooking =
        dto.type === AccessType.ENTRY && booking.status === BookingStatus.ACTIVE
          ? await tx.shortletBooking.update({
              where: { id: booking.id },
              data: { status: BookingStatus.CHECKED_IN },
            })
          : booking

      await this.log(tx, {
        estateId,
        action: 'SHORTLET_ACCESS_GRANTED',
        description: `Shortlet guest ${booking.guestName} granted ${dto.type.toLowerCase()} at ${dto.gateName}`,
        actorId: guard.id,
        actorRole: guard.role,
        metadata: { bookingId: booking.id, accessLogId: accessLog.id, gateName: dto.gateName, type: dto.type },
      })

      return { accessLog, booking: updatedBooking }
    })

    return success(
      { allowed: true, booking: result.booking, property: booking.property, resident: booking.property.resident },
      'Access Granted',
      'Shortlet access granted',
    )
  }

  async upsertSettings(userId: string, dto: UpsertShortletSettingsDto) {
    const admin = await this.getUser(userId)
    const settings = await this.prisma.shortletSettings.upsert({
      where: { estateId: admin.estateId },
      update: { annualRegistrationFee: dto.annualRegistrationFee },
      create: {
        estateId: admin.estateId,
        annualRegistrationFee: dto.annualRegistrationFee,
      },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'SHORTLET_SETTINGS_UPDATED',
      description: `Annual shortlet registration fee updated to ${dto.annualRegistrationFee}`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { settingsId: settings.id, annualRegistrationFee: dto.annualRegistrationFee },
    })

    return success(settings, 'Shortlet Settings Updated', 'Shortlet settings saved successfully')
  }

  async getSettings(userId: string) {
    const admin = await this.getUser(userId)
    const settings = await this.prisma.shortletSettings.upsert({
      where: { estateId: admin.estateId },
      update: {},
      create: { estateId: admin.estateId },
    })

    return success(settings, 'Shortlet Settings', 'Shortlet settings fetched successfully')
  }

  async getEstateProperties(userId: string) {
    const admin = await this.getUser(userId)
    const properties = await this.prisma.shortletProperty.findMany({
      where: { resident: { estateId: admin.estateId } },
      include: {
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true },
        },
        bookings: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(properties, 'Shortlet Properties', 'Estate shortlet properties fetched successfully')
  }

  async suspendProperty(userId: string, propertyId: string) {
    return this.updatePropertyStatus(userId, propertyId, ShortletStatus.SUSPENDED, 'Shortlet Property Suspended')
  }

  async activateProperty(userId: string, propertyId: string) {
    return this.updatePropertyStatus(userId, propertyId, ShortletStatus.ACTIVE, 'Shortlet Property Activated')
  }

  private async updatePropertyStatus(
    userId: string,
    propertyId: string,
    status: ShortletStatus,
    title: string,
  ) {
    const admin = await this.getUser(userId)
    const property = await this.prisma.shortletProperty.findFirst({
      where: { id: propertyId, resident: { estateId: admin.estateId } },
    })

    if (!property) {
      return error('Not Found', 'Shortlet property not found', HttpStatus.NOT_FOUND)
    }

    if (status === ShortletStatus.ACTIVE) {
      const propertyError = this.validateActiveProperty({ ...property, status: ShortletStatus.ACTIVE })
      if (propertyError) {
        return error('Cannot Activate', propertyError, HttpStatus.BAD_REQUEST)
      }
    }

    const updated = await this.prisma.shortletProperty.update({
      where: { id: property.id },
      data: { status },
    })

    return success(updated, title, `${title} successfully`)
  }
}
