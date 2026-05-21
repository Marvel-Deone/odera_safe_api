
import {
  HttpStatus,
  Injectable,
} from '@nestjs/common'

import { PrismaService } from '../../database/prisma/prisma.service'

import { success, error } from '../../common/utils/response.util'
import { CreateGuardLocationDto } from './dto/guard-location.dto'
import { GuardLocationGateway } from './guard-location.gateway'


@Injectable()
export class GuardLocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guardLocationGateway: GuardLocationGateway,
  ) { }

  async createLocation(
    userId: string,
    dto: CreateGuardLocationDto,
  ) {
    const guard =
      await this.prisma.guard.findFirst({
        where: {
          userId,
        },
      })

    if (!guard) {
      return error(
        'Not Found',
        'Guard not found',
        HttpStatus.NOT_FOUND,
      )
    }

    // await this.prisma.guardLocation.create({
    const location =
      await this.prisma.guardLocation.create({
        data: {
          guardId: guard.id,
          estateId: guard.estateId,

          latitude: dto.latitude,
          longitude: dto.longitude,

          speed: dto.speed,
          heading: dto.heading,

          batteryLevel:
            dto.batteryLevel,
        },

        include: {
          guard: {
            select: {
              id: true,
              full_name: true,
              zone_assignment: true,
            },
          },
        },
      })

    this.guardLocationGateway.broadcastLocationUpdate({
      guardId: guard.id,
      guardName: guard.full_name,
      zone: guard.zone_assignment,

      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        speed: location.speed,
        heading: location.heading,
        batteryLevel:
          location.batteryLevel,
        recordedAt:
          location.recordedAt,
      },
    })

    return success(
      'Location Updated',
    )
  }

  async getLiveLocations(
    userId: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

    if (!user) {
      return error(
        'Unauthorized',
        'User not found',
        HttpStatus.NOT_FOUND,
      )
    }

    const guards =
      await this.prisma.guard.findMany({
        where: {
          estateId: user.estateId,
          is_active: true,
        },

        include: {
          locations: {
            orderBy: {
              recordedAt: 'desc',
            },

            take: 1,
          },
        },
      })

    const liveLocations =
      guards
        .filter(
          (g) =>
            g.locations.length > 0,
        )
        .map((g) => ({
          guardId: g.id,
          guardName: g.full_name,
          zone: g.zone_assignment,
          locations: g.locations[0],
        }))

    return success(
      liveLocations,
      'Live Guard Locations',
      'Guard locations fetched successfully',
    )
  }
}