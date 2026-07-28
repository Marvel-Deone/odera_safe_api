import { HttpStatus, Injectable } from '@nestjs/common'
import { LogCategory, Role } from '@prisma/client'
import { error, success } from '../../common/utils/response.util'
import { PrismaService } from '../../database/prisma/prisma.service'
import {
  CreateEstateStreetDto,
  CreateHeavyVehicleCategoryDto,
  UpdateEstateDetailsDto,
  UpdateEstateSettingsDto,
  UpdateEstateStreetDto,
  UpdateHeavyVehicleCategoryDto,
} from './dto/estate-config.dto'

@Injectable()
export class EstateConfigService {
  constructor(private readonly prisma: PrismaService) { }

  private async getAdmin(userId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!admin) {
      error('Unauthorized', 'Admin not found', HttpStatus.NOT_FOUND)
    }

    return admin!
  }

  private async createActivityLog(data: {
    estateId: string
    action: string
    description: string
    actorId?: string | null
    actorRole?: Role | null
    metadata?: any
  }) {
    return this.prisma.activityLog.create({
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

  async getEstateConfiguration(userId: string) {
    const admin = await this.getAdmin(userId)

    const estate = await this.prisma.estate.findUnique({
      where: { id: admin.estateId },
      include: {
        estateSettings: true,
        streets: { orderBy: { name: 'asc' } },
        heavyVehicleCategories: { orderBy: { createdAt: 'desc' } },
      },
    })

    return success(estate, 'Estate Configuration', 'Estate configuration fetched successfully')
  }

  async getPublicEstates() {
    const estates = await this.prisma.estate.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        totalHouses: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })

    return success(estates, 'Estates', 'Estates fetched successfully')
  }

  async getPublicEstateStreets(estateId: string) {
    const estate = await this.prisma.estate.findUnique({
      where: { id: estateId },
      select: { id: true },
    })

    if (!estate) {
      return error('Not Found', 'Estate not found', HttpStatus.NOT_FOUND)
    }

    const streets = await this.prisma.estateStreet.findMany({
      where: { estateId },
      select: {
        id: true,
        estateId: true,
        name: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    })

    return success(streets, 'Estate Streets', 'Estate streets fetched successfully')
  }

  async updateEstateDetails(userId: string, dto: UpdateEstateDetailsDto) {
    const admin = await this.getAdmin(userId)

    const estate = await this.prisma.estate.update({
      where: { id: admin.estateId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
        ...(dto.totalHouses !== undefined ? { totalHouses: dto.totalHouses } : {}),
        ...(dto.settings !== undefined ? { settings: dto.settings } : {}),
      },
    })

    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'ESTATE_DETAILS_UPDATED',
      description: 'Estate details updated',
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { estateId: estate.id },
    })

    return success(estate, 'Estate Updated', 'Estate details updated successfully')
  }

  async getSettings(userId: string) {
    const admin = await this.getAdmin(userId)

    const settings = await this.prisma.estateSettings.upsert({
      where: { estateId: admin.estateId },
      update: {},
      create: { estateId: admin.estateId },
    })

    return success(settings, 'Estate Settings', 'Estate settings fetched successfully')
  }

  async updateSettings(userId: string, dto: UpdateEstateSettingsDto) {
    const admin = await this.getAdmin(userId)
    const before = await this.prisma.estateSettings.findUnique({
      where: { estateId: admin.estateId },
    })

    const settings = await this.prisma.estateSettings.upsert({
      where: { estateId: admin.estateId },
      update: {
        ...(dto.freeVehicleLimit !== undefined ? { freeVehicleLimit: dto.freeVehicleLimit } : {}),
        ...(dto.vehicleRegistrationFee !== undefined
          ? { vehicleRegistrationFee: dto.vehicleRegistrationFee }
          : {}),
      },
      create: {
        estateId: admin.estateId,
        freeVehicleLimit: dto.freeVehicleLimit ?? 1,
        vehicleRegistrationFee: dto.vehicleRegistrationFee ?? 0,
      },
    })

    if (
      dto.vehicleRegistrationFee !== undefined &&
      Number(before?.vehicleRegistrationFee ?? 0) !== dto.vehicleRegistrationFee
    ) {
      await this.createActivityLog({
        estateId: admin.estateId,
        action: 'VEHICLE_REGISTRATION_FEE_UPDATED',
        description: `Vehicle registration fee updated to ${dto.vehicleRegistrationFee}`,
        actorId: admin.id,
        actorRole: admin.role,
        metadata: { vehicleRegistrationFee: dto.vehicleRegistrationFee },
      })
    }

    if (
      dto.freeVehicleLimit !== undefined &&
      (before?.freeVehicleLimit ?? 1) !== dto.freeVehicleLimit
    ) {
      await this.createActivityLog({
        estateId: admin.estateId,
        action: 'FREE_VEHICLE_LIMIT_UPDATED',
        description: `Free vehicle limit updated to ${dto.freeVehicleLimit}`,
        actorId: admin.id,
        actorRole: admin.role,
        metadata: { freeVehicleLimit: dto.freeVehicleLimit },
      })
    }

    return success(settings, 'Settings Updated', 'Estate settings updated successfully')
  }

  async createStreet(userId: string, dto: CreateEstateStreetDto) {
    const admin = await this.getAdmin(userId)

    const street = await this.prisma.estateStreet.create({
      data: { estateId: admin.estateId, name: dto.name },
    })

    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'STREET_CREATED',
      description: `Street ${street.name} created`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { streetId: street.id },
    })

    return success(street, 'Street Created', 'Estate street created successfully')
  }

  async getStreets(userId: string) {
    const admin = await this.getAdmin(userId)
    const streets = await this.prisma.estateStreet.findMany({
      where: { estateId: admin.estateId },
      orderBy: { name: 'asc' },
    })

    return success(streets, 'Estate Streets', 'Estate streets fetched successfully')
  }

  async getResidentStreets(userId: string) {
    const resident = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        estateId: true,
      },
    })

    if (!resident) {
      return error('Unauthorized', 'Resident not found', HttpStatus.NOT_FOUND)
    }

    if (resident.role !== Role.RESIDENT) {
      return error('Forbidden', 'Only residents can fetch resident streets', HttpStatus.FORBIDDEN)
    }

    const streets = await this.prisma.estateStreet.findMany({
      where: { estateId: resident.estateId },
      orderBy: { name: 'asc' },
    })

    return success(streets, 'Estate Streets', 'Estate streets fetched successfully')
  }

  async updateStreet(userId: string, streetId: string, dto: UpdateEstateStreetDto) {
    const admin = await this.getAdmin(userId)
    const street = await this.prisma.estateStreet.findFirst({
      where: { id: streetId, estateId: admin.estateId },
    })

    if (!street) {
      return error('Not Found', 'Estate street not found', HttpStatus.NOT_FOUND)
    }

    const updated = await this.prisma.estateStreet.update({
      where: { id: street.id },
      data: { name: dto.name },
    })

    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'STREET_UPDATED',
      description: `Street ${street.name} updated to ${updated.name}`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { streetId: street.id },
    })

    return success(updated, 'Street Updated', 'Estate street updated successfully')
  }

  async deleteStreet(userId: string, streetId: string) {
    const admin = await this.getAdmin(userId)
    const street = await this.prisma.estateStreet.findFirst({
      where: { id: streetId, estateId: admin.estateId },
    })

    if (!street) {
      return error('Not Found', 'Estate street not found', HttpStatus.NOT_FOUND)
    }

    await this.prisma.estateStreet.delete({ where: { id: street.id } })
    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'STREET_DELETED',
      description: `Street ${street.name} deleted`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { streetId: street.id },
    })

    return success(null, 'Street Deleted', 'Estate street deleted successfully')
  }

  async createHeavyVehicleCategory(userId: string, dto: CreateHeavyVehicleCategoryDto) {
    const admin = await this.getAdmin(userId)

    const category = await this.prisma.heavyVehicleCategory.create({
      data: {
        estateId: admin.estateId,
        name: dto.name,
        description: dto.description,
        amount: dto.amount,
        active: dto.active ?? true,
      },
    })

    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'HEAVY_VEHICLE_CATEGORY_CREATED',
      description: `Heavy vehicle category ${category.name} created`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { categoryId: category.id },
    })

    return success(category, 'Category Created', 'Heavy vehicle category created successfully')
  }

  async getHeavyVehicleCategories(userId: string) {
    const admin = await this.getAdmin(userId)
    const categories = await this.prisma.heavyVehicleCategory.findMany({
      where: { estateId: admin.estateId },
      orderBy: { createdAt: 'desc' },
    })

    return success(categories, 'Heavy Vehicle Categories', 'Categories fetched successfully')
  }

  async updateHeavyVehicleCategory(
    userId: string,
    categoryId: string,
    dto: UpdateHeavyVehicleCategoryDto,
  ) {
    const admin = await this.getAdmin(userId)
    const category = await this.prisma.heavyVehicleCategory.findFirst({
      where: { id: categoryId, estateId: admin.estateId },
    })

    if (!category) {
      return error('Not Found', 'Heavy vehicle category not found', HttpStatus.NOT_FOUND)
    }

    const updated = await this.prisma.heavyVehicleCategory.update({
      where: { id: category.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    })

    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'HEAVY_VEHICLE_CATEGORY_UPDATED',
      description: `Heavy vehicle category ${updated.name} updated`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { categoryId: category.id },
    })

    return success(updated, 'Category Updated', 'Heavy vehicle category updated successfully')
  }

  async deleteHeavyVehicleCategory(userId: string, categoryId: string) {
    const admin = await this.getAdmin(userId)
    const category = await this.prisma.heavyVehicleCategory.findFirst({
      where: { id: categoryId, estateId: admin.estateId },
    })

    if (!category) {
      return error('Not Found', 'Heavy vehicle category not found', HttpStatus.NOT_FOUND)
    }

    await this.prisma.heavyVehicleCategory.delete({ where: { id: category.id } })
    await this.createActivityLog({
      estateId: admin.estateId,
      action: 'HEAVY_VEHICLE_CATEGORY_DELETED',
      description: `Heavy vehicle category ${category.name} deleted`,
      actorId: admin.id,
      actorRole: admin.role,
      metadata: { categoryId: category.id },
    })

    return success(null, 'Category Deleted', 'Heavy vehicle category deleted successfully')
  }
}
