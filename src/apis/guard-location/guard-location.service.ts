
import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
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

    const checkpoints =
      await this.prisma.patrolCheckpoint.findMany({
        where: {
          estateId: guard.estateId,
          isActive: true,
        },
      })

    let nextCheckpoint: {
      id: string
      name: string
      latitude: number | null
      longitude: number | null
    } | null = null

    if (checkpoints.length > 0) {
      let closest = checkpoints[0]
      let shortestDistance = Infinity

      checkpoints.forEach((checkpoint) => {
        const latDiff =
          Number(location.latitude) -
          Number(checkpoint.latitude)

        const lngDiff =
          Number(location.longitude) -
          Number(checkpoint.longitude)

        const distance = Math.sqrt(
          latDiff * latDiff +
          lngDiff * lngDiff,
        )

        if (distance < shortestDistance) {
          shortestDistance = distance
          closest = checkpoint
        }
      })

      nextCheckpoint = {
        id: closest.id,
        name: closest.name,
        latitude: closest.latitude,
        longitude: closest.longitude,
      }
    }

    this.guardLocationGateway.broadcastLocationUpdate({
      guardId: guard.id,
      guardName: guard.full_name,
      zone: guard.zone_assignment,

      currentLocation: location,

      trail: [location],

      nextCheckpoint,
    })

    return success(
      'Location Updated',
    )
  }

  async getLiveLocations(
    userId: string,
  ) {
    console.log('userId:', userId);
    if (!userId) {
      throw new UnauthorizedException(
        'User not authenticated',
      )
    }

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

            take: 20,
          },
        },
      })

    const checkpoints =
      await this.prisma.patrolCheckpoint.findMany({
        where: {
          estateId: user.estateId,
          isActive: true,
        },
      })

    const liveLocations =
      guards
        .filter(
          (g) =>
            g.locations.length > 0,
        )
        // .map((g) => ({
        //   guardId: g.id,
        //   guardName: g.full_name,
        //   zone: g.zone_assignment,
        //   // locations: g.locations[0],
        //   currentLocation: g.locations[0],

        //   trail:
        //     g.locations.map((l) => ({
        //       latitude: l.latitude,
        //       longitude: l.longitude,
        //       recordedAt: l.recordedAt,
        //     })),
        // }))
        .map((g) => {
          const currentLocation = g.locations[0]

          let nextCheckpoint: {
            id: string
            name: string
            latitude: number | null
            longitude: number | null
          } | null = null

          if (checkpoints.length > 0) {
            let closest = checkpoints[0]
            let shortestDistance = Infinity

            checkpoints.forEach((checkpoint) => {
              const latDiff =
                Number(currentLocation.latitude) -
                Number(checkpoint.latitude)

              const lngDiff =
                Number(currentLocation.longitude) -
                Number(checkpoint.longitude)

              const distance = Math.sqrt(
                latDiff * latDiff +
                lngDiff * lngDiff,
              )

              if (distance < shortestDistance) {
                shortestDistance = distance
                closest = checkpoint
              }
            })

            nextCheckpoint = {
              id: closest.id,
              name: closest.name,
              latitude: closest.latitude,
              longitude: closest.longitude,
            }
          }

          return {
            guardId: g.id,
            guardName: g.full_name,
            zone: g.zone_assignment,

            currentLocation,

            nextCheckpoint,

            trail: g.locations.map((l) => ({
              latitude: l.latitude,
              longitude: l.longitude,
              recordedAt: l.recordedAt,
            })),
          }
        })

    return success(
      liveLocations,
      'Live Guard Locations',
      'Guard locations fetched successfully',
    )
  }
}