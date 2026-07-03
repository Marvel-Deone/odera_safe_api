import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import {
  LogCategory,
  Prisma,
  Role,
  VehicleStatus,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@prisma/client'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import { CreateVehicleDto, RejectVehicleDto, UpdateVehicleDto, VehicleAccessDto } from './dto/vehicle.dto'

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) { }

  private readonly logger = new Logger(VehicleService.name)


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

  // async createVehicle(userId: string, dto: CreateVehicleDto) {
  //   const { user, resident } = await this.getResident(userId)

  //   const vehicle = await this.prisma.vehicle.create({
  //     data: {
  //       residentId: resident.id,
  //       plateNumber: this.normalizePlate(dto.plateNumber),
  //       vehicleType: dto.vehicleType,
  //       make: dto.make,
  //       model: dto.model,
  //       color: dto.color,
  //       year: dto.year,
  //       registrationDocUrl: dto.registrationDocUrl,
  //       vehiclePhotoUrl: dto.vehiclePhotoUrl,
  //       status: VehicleStatus.PENDING,
  //     },
  //   })

  //   await this.log(this.prisma, {
  //     estateId: resident.estateId,
  //     action: 'VEHICLE_REGISTERED',
  //     description: `Resident registered vehicle ${vehicle.plateNumber}`,
  //     actorId: user.id,
  //     actorRole: Role.RESIDENT,
  //     metadata: { vehicleId: vehicle.id, residentId: resident.id },
  //   })

  //   return success(vehicle, 'Vehicle Registered', 'Vehicle submitted for admin review')
  // }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    try {
      const { user, resident } = await this.getResident(userId)

      const vehicle = await this.prisma.vehicle.create({
        data: {
          residentId: resident.id,
          plateNumber: this.normalizePlate(dto.plateNumber),
          vehicleType: dto.vehicleType,
          make: dto.make,
          model: dto.model,
          color: dto.color,
          year: dto.year,
          registrationDocUrl: dto.registrationDocUrl,
          vehiclePhotoUrl: dto.vehiclePhotoUrl,
          status: VehicleStatus.PENDING,
        },
      })

      await this.log(this.prisma, {
        estateId: resident.estateId,
        action: 'VEHICLE_REGISTERED',
        description: `Resident registered vehicle ${vehicle.plateNumber}`,
        actorId: user.id,
        actorRole: Role.RESIDENT,
        metadata: { vehicleId: vehicle.id, residentId: resident.id },
      })

      return success(
        vehicle,
        'Vehicle Registered',
        'Vehicle submitted for admin review',
      )
    } catch (error: any) {
      this.logger.error(
        `Create vehicle failed for user ${userId}`,
        error?.stack || error?.message,
      )

      throw new BadRequestException({
        message: 'Vehicle registration failed',
        reason: error?.message || 'Unknown error',
      })
    }
  }

  async getMyVehicles(userId: string) {
    const { resident } = await this.getResident(userId)
    const vehicles = await this.prisma.vehicle.findMany({
      where: { residentId: resident.id },
      orderBy: { createdAt: 'desc' },
    })

    return success(vehicles, 'Vehicles', 'Resident vehicles fetched successfully')
  }

  async updateVehicle(userId: string, vehicleId: string, dto: UpdateVehicleDto) {
    const { resident } = await this.getResident(userId)
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, residentId: resident.id },
    })

    if (!vehicle) {
      return error('Not Found', 'Vehicle not found', HttpStatus.NOT_FOUND)
    }

    const resubmittableStatuses: VehicleStatus[] = [
      VehicleStatus.REJECTED,
      VehicleStatus.PAYMENT_FAILED,
    ]

    if (!resubmittableStatuses.includes(vehicle.status)) {
      return error(
        'Invalid Status',
        'Only rejected or payment failed vehicles can be edited for resubmission',
        HttpStatus.BAD_REQUEST,
      )
    }

    const updated = await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        ...(dto.plateNumber !== undefined ? { plateNumber: this.normalizePlate(dto.plateNumber) } : {}),
        ...(dto.vehicleType !== undefined ? { vehicleType: dto.vehicleType } : {}),
        ...(dto.make !== undefined ? { make: dto.make } : {}),
        ...(dto.model !== undefined ? { model: dto.model } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.year !== undefined ? { year: dto.year } : {}),
        ...(dto.registrationDocUrl !== undefined ? { registrationDocUrl: dto.registrationDocUrl } : {}),
        ...(dto.vehiclePhotoUrl !== undefined ? { vehiclePhotoUrl: dto.vehiclePhotoUrl } : {}),
      },
    })

    return success(updated, 'Vehicle Updated', 'Vehicle details updated successfully')
  }

  async resubmitVehicle(userId: string, vehicleId: string, dto?: UpdateVehicleDto) {
    const { user, resident } = await this.getResident(userId)
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, residentId: resident.id },
    })

    if (!vehicle) {
      return error('Not Found', 'Vehicle not found', HttpStatus.NOT_FOUND)
    }

    const resubmittableStatuses: VehicleStatus[] = [
      VehicleStatus.REJECTED,
      VehicleStatus.PAYMENT_FAILED,
    ]

    if (!resubmittableStatuses.includes(vehicle.status)) {
      return error(
        'Invalid Status',
        'Only rejected or payment failed vehicles can be resubmitted',
        HttpStatus.BAD_REQUEST,
      )
    }

    const updated = await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        ...(dto?.plateNumber !== undefined ? { plateNumber: this.normalizePlate(dto.plateNumber) } : {}),
        ...(dto?.vehicleType !== undefined ? { vehicleType: dto.vehicleType } : {}),
        ...(dto?.make !== undefined ? { make: dto.make } : {}),
        ...(dto?.model !== undefined ? { model: dto.model } : {}),
        ...(dto?.color !== undefined ? { color: dto.color } : {}),
        ...(dto?.year !== undefined ? { year: dto.year } : {}),
        ...(dto?.registrationDocUrl !== undefined ? { registrationDocUrl: dto.registrationDocUrl } : {}),
        ...(dto?.vehiclePhotoUrl !== undefined ? { vehiclePhotoUrl: dto.vehiclePhotoUrl } : {}),
        status: VehicleStatus.PENDING,
        rejectionReason: null,
        approvedAt: null,
        approvedById: null,
      },
    })

    await this.log(this.prisma, {
      estateId: resident.estateId,
      action: 'VEHICLE_RESUBMITTED',
      description: `Resident resubmitted vehicle ${updated.plateNumber} for review`,
      actorId: user.id,
      actorRole: Role.RESIDENT,
      metadata: { vehicleId: updated.id, residentId: resident.id },
    })

    return success(updated, 'Vehicle Resubmitted', 'Vehicle resubmitted for review')
  }

  async getEstateVehicles(userId: string) {
    const admin = await this.getUser(userId)
    const vehicles = await this.prisma.vehicle.findMany({
      where: { resident: { estateId: admin.estateId } },
      include: {
        resident: {
          select: { id: true, first_name: true, last_name: true, house_no: true, block: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return success(vehicles, 'Estate Vehicles', 'Estate vehicles fetched successfully')
  }

  async approveVehicle(userId: string, vehicleId: string, isRetry = false) {
    const admin = await this.getUser(userId)

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { resident: { include: { wallet: true } } },
    })

    if (!vehicle) {
      return error('Not Found', 'Vehicle not found', HttpStatus.NOT_FOUND)
    }

    if (vehicle.resident.estateId !== admin.estateId) {
      return error('Forbidden', 'Cannot approve vehicle outside your estate', HttpStatus.FORBIDDEN)
    }

    const allowedStatuses: VehicleStatus[] = isRetry
      ? [VehicleStatus.PAYMENT_FAILED]
      : [VehicleStatus.PENDING, VehicleStatus.PAYMENT_FAILED]

    if (!allowedStatuses.includes(vehicle.status)) {
      return error('Invalid Status', 'Vehicle is not awaiting approval', HttpStatus.BAD_REQUEST)
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const activeVehicleCount = await tx.vehicle.count({
        where: {
          residentId: vehicle.residentId,
          status: VehicleStatus.ACTIVE,
        },
      })

      const settings = await tx.estateSettings.upsert({
        where: { estateId: admin.estateId },
        update: {},
        create: { estateId: admin.estateId },
      })

      const fee = this.toNumber(settings.vehicleRegistrationFee)
      const shouldCharge = activeVehicleCount > settings.freeVehicleLimit && fee > 0

      if (shouldCharge) {
        const wallet =
          vehicle.resident.wallet ??
          (await tx.wallet.create({ data: { residentId: vehicle.residentId } }))

        const latestWallet = await tx.wallet.findUnique({ where: { id: wallet.id } })

        if (!latestWallet || this.toNumber(latestWallet.balance) < fee) {
          const failedVehicle = await tx.vehicle.update({
            where: { id: vehicle.id },
            data: {
              status: VehicleStatus.PAYMENT_FAILED,
              rejectionReason: 'Insufficient wallet balance for vehicle registration fee',
            },
          })

          await this.log(tx, {
            estateId: admin.estateId,
            action: 'VEHICLE_PAYMENT_FAILED',
            description: 'Vehicle approval failed due to insufficient wallet balance',
            actorId: admin.id,
            actorRole: admin.role,
            metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId, fee },
          })

          return { vehicle: failedVehicle, charged: false, paymentFailed: true }
        }

        await tx.wallet.update({
          where: { id: latestWallet.id },
          data: { balance: { decrement: fee } },
        })

        await tx.walletTransaction.create({
          data: {
            walletId: latestWallet.id,
            type: WalletTransactionType.VEHICLE_REGISTRATION,
            status: WalletTransactionStatus.SUCCESS,
            amount: fee,
            reference: this.reference('vehicle_fee'),
            description: `Vehicle registration fee for ${vehicle.plateNumber}`,
          },
        })

        await this.log(tx, {
          estateId: admin.estateId,
          action: 'VEHICLE_FEE_CHARGED',
          description: `NGN ${fee.toLocaleString()} vehicle registration fee deducted from resident wallet`,
          actorId: null,
          actorRole: null,
          metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId, fee },
        })
      }

      const approved = await tx.vehicle.update({
        where: { id: vehicle.id },
        data: {
          status: VehicleStatus.ACTIVE,
          approvedAt: new Date(),
          approvedById: admin.id,
          rejectionReason: null,
        },
      })

      await this.log(tx, {
        estateId: admin.estateId,
        action: isRetry ? 'VEHICLE_APPROVAL_RETRY' : 'VEHICLE_APPROVED',
        description: isRetry
          ? `Admin retried approval for vehicle ${vehicle.plateNumber}`
          : `Admin approved vehicle ${vehicle.plateNumber}`,
        actorId: admin.id,
        actorRole: admin.role,
        metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId, charged: shouldCharge },
      })

      if (isRetry) {
        await this.log(tx, {
          estateId: admin.estateId,
          action: 'VEHICLE_APPROVED',
          description: `Admin approved vehicle ${vehicle.plateNumber}`,
          actorId: admin.id,
          actorRole: admin.role,
          metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId },
        })
      }

      return { vehicle: approved, charged: shouldCharge, paymentFailed: false }
    })

    if (result.paymentFailed) {
      return error<any>(
        'Payment Failed',
        'Insufficient wallet balance for vehicle registration fee',
        HttpStatus.BAD_REQUEST,
        result.vehicle,
      )
    }

    return success(result, 'Vehicle Approved', 'Vehicle approved successfully')
  }

  async rejectVehicle(userId: string, vehicleId: string, dto: RejectVehicleDto) {
    const admin = await this.getUser(userId)
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { resident: true },
    })

    if (!vehicle) {
      return error('Not Found', 'Vehicle not found', HttpStatus.NOT_FOUND)
    }

    if (vehicle.resident.estateId !== admin.estateId) {
      return error('Forbidden', 'Cannot reject vehicle outside your estate', HttpStatus.FORBIDDEN)
    }

    const updated = await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        status: VehicleStatus.REJECTED,
        rejectionReason: dto.rejectionReason,
        approvedAt: null,
        approvedById: null,
      },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'VEHICLE_REJECTED',
      description: `Admin rejected vehicle ${vehicle.plateNumber}`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId, reason: dto.rejectionReason },
    })

    return success(updated, 'Vehicle Rejected', 'Vehicle rejected successfully')
  }

  async suspendVehicle(userId: string, vehicleId: string) {
    const admin = await this.getUser(userId)
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { resident: true },
    })

    if (!vehicle) {
      return error('Not Found', 'Vehicle not found', HttpStatus.NOT_FOUND)
    }

    if (vehicle.resident.estateId !== admin.estateId) {
      return error('Forbidden', 'Cannot suspend vehicle outside your estate', HttpStatus.FORBIDDEN)
    }

    const updated = await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: VehicleStatus.SUSPENDED },
    })

    await this.log(this.prisma, {
      estateId: admin.estateId,
      action: 'VEHICLE_SUSPENDED',
      description: `Vehicle ${vehicle.plateNumber} suspended`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { vehicleId: vehicle.id, residentId: vehicle.residentId },
    })

    return success(updated, 'Vehicle Suspended', 'Vehicle suspended successfully')
  }

  async validateAccess(userId: string, dto: VehicleAccessDto) {
    const actor = await this.getUser(userId)
    const plateNumber = this.normalizePlate(dto.plateNumber)

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber },
      include: {
        resident: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            phone: true,
            house_no: true,
            block: true,
            estateId: true,
          },
        },
      },
    })

    const deny = async (reason: string, estateId?: string, vehicleId?: string) => {
      await this.log(this.prisma, {
        estateId: estateId ?? actor.estateId,
        action: 'VEHICLE_ACCESS_DENIED',
        description: `Vehicle ${plateNumber} denied access at ${dto.gateName}`,
        actorId: actor.id,
        actorRole: actor.role,
        metadata: { plateNumber, vehicleId, gateName: dto.gateName, direction: dto.direction, reason },
      })

      return success({ allowed: false, reason }, 'Access Denied', reason)
    }

    if (!vehicle) {
      return deny('Vehicle not found')
    }

    if (vehicle.resident.estateId !== actor.estateId) {
      return deny('Vehicle does not belong to this estate', vehicle.resident.estateId, vehicle.id)
    }

    if (vehicle.status !== VehicleStatus.ACTIVE) {
      return deny(`Vehicle is ${vehicle.status.toLowerCase()}`, vehicle.resident.estateId, vehicle.id)
    }

    const log = await this.prisma.vehicleAccessLog.create({
      data: {
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        gateName: dto.gateName,
        direction: dto.direction,
      },
    })

    await this.log(this.prisma, {
      estateId: vehicle.resident.estateId,
      action: 'VEHICLE_ACCESS_GRANTED',
      description: `Vehicle ${vehicle.plateNumber} granted ${dto.direction.toLowerCase()} at ${dto.gateName}`,
      actorId: actor.id,
      actorRole: actor.role,
      metadata: { vehicleId: vehicle.id, accessLogId: log.id, gateName: dto.gateName, direction: dto.direction },
    })

    return success(
      { allowed: true, resident: vehicle.resident, vehicle },
      'Access Granted',
      'Vehicle access granted',
    )
  }
}
