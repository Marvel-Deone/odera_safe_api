import { HttpStatus, Injectable } from '@nestjs/common'
import {
  HeavyVehicleRequestStatus,
  LogCategory,
  PaymentOption,
  PaymentStatus,
  Prisma,
  Role,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@prisma/client'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import {
  CreateHeavyVehiclePassDto,
  HeavyVehicleAccessDto,
  RejectHeavyVehiclePassDto,
} from './dto/heavy-vehicle.dto'

@Injectable()
export class HeavyVehicleService {
  constructor(private readonly prisma: PrismaService) {}

  private reference(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  }

  private toNumber(value: Prisma.Decimal | number | string | null | undefined) {
    return value === null || value === undefined ? 0 : Number(value)
  }

  private normalizePlate(plateNumber: string) {
    return plateNumber.trim().toUpperCase()
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
        category: LogCategory.VEHICLE,
        action: data.action,
        description: data.description,
        actorId: data.actorId,
        actorRole: data.actorRole,
        metadata: data.metadata,
      },
    })
  }

  private async chargePassWallet(
    tx: Prisma.TransactionClient,
    residentId: string,
    amount: number,
    plateNumber: string,
  ) {
    const wallet =
      (await tx.wallet.findUnique({ where: { residentId } })) ??
      (await tx.wallet.create({ data: { residentId } }))

    const latestWallet = await tx.wallet.findUnique({ where: { id: wallet.id } })

    if (!latestWallet || this.toNumber(latestWallet.balance) < amount) {
      return { paid: false, walletId: wallet.id }
    }

    await tx.wallet.update({
      where: { id: latestWallet.id },
      data: { balance: { decrement: amount } },
    })

    const transaction = await tx.walletTransaction.create({
      data: {
        walletId: latestWallet.id,
        type: WalletTransactionType.HEAVY_VEHICLE_PASS,
        status: WalletTransactionStatus.SUCCESS,
        amount,
        reference: this.reference('heavy_vehicle'),
        description: `Heavy vehicle pass payment for ${plateNumber}`,
      },
    })

    return { paid: true, walletId: latestWallet.id, transaction }
  }

  async createPass(userId: string, dto: CreateHeavyVehiclePassDto) {
    const { user, resident } = await this.getResident(userId)

    const category = await this.prisma.heavyVehicleCategory.findFirst({
      where: {
        id: dto.heavyVehicleCategoryId,
        estateId: resident.estateId,
        active: true,
      },
    })

    if (!category) {
      return error('Not Found', 'Heavy vehicle category not found or inactive', HttpStatus.NOT_FOUND)
    }

    const entryDate = new Date(dto.entryDate)
    const exitDate = new Date(dto.exitDate)

    if (exitDate < entryDate) {
      return error('Invalid Dates', 'Exit date must be after entry date', HttpStatus.BAD_REQUEST)
    }

    const amount = this.toNumber(category.amount)
    const plateNumber = this.normalizePlate(dto.plateNumber)

    const result = await this.prisma.$transaction(async (tx) => {
      let paymentStatus: PaymentStatus = PaymentStatus.PENDING
      let paymentResult: any = null

      if (dto.paymentOption === PaymentOption.PAY_NOW) {
        paymentResult = await this.chargePassWallet(tx, resident.id, amount, plateNumber)
        paymentStatus = paymentResult.paid ? PaymentStatus.PAID : PaymentStatus.FAILED
      }

      const pass = await tx.heavyVehiclePass.create({
        data: {
          residentId: resident.id,
          heavyVehicleCategoryId: category.id,
          driverName: dto.driverName,
          driverPhone: dto.driverPhone,
          plateNumber,
          vehicleDescription: dto.vehicleDescription,
          entryDate,
          exitDate,
          paymentOption: dto.paymentOption,
          amount,
          status: HeavyVehicleRequestStatus.PENDING,
          paymentStatus,
        },
        include: { heavyVehicleCategory: true },
      })

      await this.log(tx, {
        estateId: resident.estateId,
        action: 'HEAVY_VEHICLE_REQUESTED',
        description: `Resident requested heavy vehicle pass for truck ${plateNumber}`,
        actorId: user.id,
        actorRole: Role.RESIDENT,
        metadata: { passId: pass.id, residentId: resident.id, categoryId: category.id },
      })

      if (dto.paymentOption === PaymentOption.PAY_NOW && paymentStatus === PaymentStatus.PAID) {
        await this.log(tx, {
          estateId: resident.estateId,
          action: 'HEAVY_VEHICLE_PAYMENT_SUCCESS',
          description: 'Heavy vehicle pass payment completed',
          actorId: user.id,
          actorRole: Role.RESIDENT,
          metadata: { passId: pass.id, residentId: resident.id, amount, transactionId: paymentResult.transaction?.id },
        })
      }

      if (dto.paymentOption === PaymentOption.PAY_NOW && paymentStatus === PaymentStatus.FAILED) {
        await this.log(tx, {
          estateId: resident.estateId,
          action: 'HEAVY_VEHICLE_PAYMENT_FAILED',
          description: 'Heavy vehicle pass payment failed due to insufficient wallet balance',
          actorId: user.id,
          actorRole: Role.RESIDENT,
          metadata: { passId: pass.id, residentId: resident.id, amount },
        })
      }

      return pass
    })

    return success(result, 'Heavy Vehicle Pass Requested', 'Heavy vehicle pass request submitted')
  }

  async getMyPasses(userId: string) {
    const { resident } = await this.getResident(userId)
    const passes = await this.prisma.heavyVehiclePass.findMany({
      where: { residentId: resident.id },
      include: { heavyVehicleCategory: true },
      orderBy: { createdAt: 'desc' },
    })

    return success(passes, 'Heavy Vehicle Passes', 'Resident heavy vehicle passes fetched successfully')
  }

  async retryPayment(userId: string, passId: string) {
    const { user, resident } = await this.getResident(userId)
    const pass = await this.prisma.heavyVehiclePass.findFirst({
      where: { id: passId, residentId: resident.id },
    })

    if (!pass) {
      return error('Not Found', 'Heavy vehicle pass not found', HttpStatus.NOT_FOUND)
    }

    if (pass.paymentStatus === PaymentStatus.PAID) {
      return error('Already Paid', 'Heavy vehicle pass has already been paid', HttpStatus.BAD_REQUEST)
    }

    const amount = this.toNumber(pass.amount)
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await this.chargePassWallet(tx, resident.id, amount, pass.plateNumber)

      const updated = await tx.heavyVehiclePass.update({
        where: { id: pass.id },
        data: { paymentStatus: payment.paid ? PaymentStatus.PAID : PaymentStatus.FAILED },
      })

      await this.log(tx, {
        estateId: resident.estateId,
        action: payment.paid ? 'HEAVY_VEHICLE_PAYMENT_SUCCESS' : 'HEAVY_VEHICLE_PAYMENT_FAILED',
        description: payment.paid
          ? 'Heavy vehicle pass payment completed'
          : 'Heavy vehicle pass payment failed due to insufficient wallet balance',
        actorId: user.id,
        actorRole: Role.RESIDENT,
        metadata: { passId: pass.id, residentId: resident.id, amount, transactionId: payment.transaction?.id },
      })

      return { pass: updated, paid: payment.paid }
    })

    if (!result.paid) {
      return error<any>(
        'Payment Failed',
        'Insufficient wallet balance for heavy vehicle pass',
        HttpStatus.BAD_REQUEST,
        result.pass,
      )
    }

    return success(result.pass, 'Payment Successful', 'Heavy vehicle pass payment completed')
  }

  async getEstatePasses(userId: string) {
    const admin = await this.getUser(userId)
    const passes = await this.prisma.heavyVehiclePass.findMany({
      where: { resident: { estateId: admin.estateId } },
      include: {
        heavyVehicleCategory: true,
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(passes, 'Heavy Vehicle Requests', 'Heavy vehicle requests fetched successfully')
  }

  async approvePass(userId: string, passId: string) {
    const admin = await this.getUser(userId)
    const pass = await this.prisma.heavyVehiclePass.findUnique({
      where: { id: passId },
      include: { resident: true },
    })

    if (!pass) {
      return error('Not Found', 'Heavy vehicle pass not found', HttpStatus.NOT_FOUND)
    }

    if (pass.resident.estateId !== admin.estateId) {
      return error('Forbidden', 'Cannot approve pass outside your estate', HttpStatus.FORBIDDEN)
    }

    if (pass.status !== HeavyVehicleRequestStatus.PENDING) {
      return error('Invalid Status', 'Only pending passes can be approved', HttpStatus.BAD_REQUEST)
    }

    const updated = await this.prisma.heavyVehiclePass.update({
      where: { id: pass.id },
      data: {
        status: HeavyVehicleRequestStatus.APPROVED,
        approvedById: admin.id,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'HEAVY_VEHICLE_APPROVED',
      description: 'Admin approved heavy vehicle pass',
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { passId: pass.id, residentId: pass.residentId },
    })

    return success(updated, 'Pass Approved', 'Heavy vehicle pass approved successfully')
  }

  async rejectPass(userId: string, passId: string, dto: RejectHeavyVehiclePassDto) {
    const admin = await this.getUser(userId)
    const pass = await this.prisma.heavyVehiclePass.findUnique({
      where: { id: passId },
      include: { resident: true },
    })

    if (!pass) {
      return error('Not Found', 'Heavy vehicle pass not found', HttpStatus.NOT_FOUND)
    }

    if (pass.resident.estateId !== admin.estateId) {
      return error('Forbidden', 'Cannot reject pass outside your estate', HttpStatus.FORBIDDEN)
    }

    const updated = await this.prisma.heavyVehiclePass.update({
      where: { id: pass.id },
      data: {
        status: HeavyVehicleRequestStatus.REJECTED,
        rejectionReason: dto.rejectionReason,
        approvedById: null,
        approvedAt: null,
      },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'HEAVY_VEHICLE_REJECTED',
      description: 'Admin rejected heavy vehicle pass',
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { passId: pass.id, residentId: pass.residentId, reason: dto.rejectionReason },
    })

    return success(updated, 'Pass Rejected', 'Heavy vehicle pass rejected successfully')
  }

  async validateAccess(userId: string, dto: HeavyVehicleAccessDto) {
    const actor = await this.getUser(userId)
    const pass = await this.prisma.heavyVehiclePass.findUnique({
      where: { id: dto.passId },
      include: {
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true, estateId: true },
        },
        heavyVehicleCategory: true,
      },
    })

    const deny = async (reason: string, estateId?: string) => {
      await this.log(this.prisma, {
        estateId: estateId ?? actor.estateId,
        action: 'HEAVY_VEHICLE_ACCESS_DENIED',
        description: `Heavy vehicle denied access due to ${reason.toLowerCase()}`,
        actorId: actor.id,
        actorRole: actor.role,
        metadata: { passId: dto.passId, gateName: dto.gateName, direction: dto.direction, reason },
      })

      return success({ allowed: false, reason }, 'Access Denied', reason)
    }

    if (!pass) {
      return deny('Pass not found')
    }

    if (pass.resident.estateId !== actor.estateId) {
      return deny('Pass does not belong to this estate', pass.resident.estateId)
    }

    if (pass.status !== HeavyVehicleRequestStatus.APPROVED) {
      return deny('Pass is not approved', pass.resident.estateId)
    }

    if (pass.paymentStatus !== PaymentStatus.PAID) {
      return deny('Unpaid fee', pass.resident.estateId)
    }

    const now = new Date()
    if (now < pass.entryDate || now > pass.exitDate) {
      return deny('Pass is outside its valid access date window', pass.resident.estateId)
    }

    const accessLog = await this.prisma.heavyVehicleAccessLog.create({
      data: {
        heavyVehiclePassId: pass.id,
        gateName: dto.gateName,
        direction: dto.direction,
      },
    })

    await this.log(this.prisma, {
      estateId: pass.resident.estateId,
      action: 'HEAVY_VEHICLE_ACCESS_GRANTED',
      description: `Heavy vehicle granted access through ${dto.gateName}`,
      actorId: actor.id,
      actorRole: actor.role,
      metadata: { passId: pass.id, accessLogId: accessLog.id, gateName: dto.gateName, direction: dto.direction },
    })

    return success(
      { allowed: true, pass, resident: pass.resident },
      'Access Granted',
      'Heavy vehicle access granted',
    )
  }
}
