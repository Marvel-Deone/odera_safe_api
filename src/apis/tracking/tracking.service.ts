import {
    Injectable,
} from '@nestjs/common'

import { randomUUID } from 'crypto'

import { PrismaService } from '../../database/prisma/prisma.service'

import { UpdateLocationDto } from './dto/location.dto'
import { success } from '../../common/utils/response.util'

@Injectable()
export class TrackingService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async startTracking(
        visitorId: string,
    ) {
        const token =
            randomUUID()

        const session =
            await this.prisma.trackingSession.create({
                data: {
                    visitorId,
                    token,
                },

                include: {
                    visitor: true,
                },
            })

        return {
            session,

            trackingUrl: `${process.env.FRONTEND_URL}/visitor/live-tracking/${token}`,
        }
    }

    async validateTrackingToken(
        token: string,
    ) {
        // return this.prisma.trackingSession.findUnique({
        //     where: {
        //         token,
        //         isActive: true,
        //     },

        //     include: {
        //         visitor: true,
        //     },
        // })
        const session = await this.prisma.trackingSession.findUnique({
            where: { token },
            include: {
                visitor: true,
            },
        })

        if (!session || !session.isActive) {
            return null
        }

        return session
    }

    async updateLocation(
        dto: UpdateLocationDto,
    ) {
        const session =
            await this.prisma.trackingSession.findUnique({
                where: {
                    token: dto.token,
                },
            })

        if (!session || !session.isActive) {
            return null
        }

        // prevent spam updates
        if (session.lastLocationAt) {
            const secondsSinceLastUpdate =
                (Date.now() -
                    new Date(
                        session.lastLocationAt,
                    ).getTime()) /
                1000

            if (secondsSinceLastUpdate < 5) {
                return success(
                    null,
                    'Skipped',
                    'Location update throttled',
                )
            }
        }

        await this.prisma.$transaction([
            this.prisma.visitorLocation.create({
                data: {
                    trackingSessionId:
                        session.id,

                    visitorId:
                        session.visitorId,

                    latitude:
                        dto.latitude,

                    longitude:
                        dto.longitude,

                    accuracy:
                        dto.accuracy,
                },
            }),

            this.prisma.trackingSession.update({
                where: {
                    id: session.id,
                },

                data: {
                    currentLat:
                        dto.latitude,

                    currentLng:
                        dto.longitude,

                    lastLocationAt:
                        new Date(),
                },
            }),
        ])

        return success(
            null,
            'Updated',
            'Location updated successfully',
        )
    }

    // async getLiveTracking() {
    //     const sessions =
    //         await this.prisma.trackingSession.findMany({
    //             where: {
    //                 isActive: true,
    //             },

    //             include: {
    //                 visitor: true,

    //                 locations: {
    //                     orderBy: {
    //                         createdAt: 'desc',
    //                     },

    //                     take: 1,
    //                 },
    //             },
    //         })

    //     const live_tracking = sessions.map(
    //         (session) => {
    //             const loc =
    //                 session.locations[0]

    //             return {
    //                 sessionId:
    //                     session.id,

    //                 visitorId:
    //                     session.visitor.id,

    //                 visitorName:
    //                     session.visitor.name,

    //                 latitude:
    //                     loc?.latitude || null,

    //                 longitude:
    //                     loc?.longitude || null,

    //                 accuracy:
    //                     loc?.accuracy || null,

    //                 updatedAt:
    //                     loc?.createdAt || null,

    //                 isActive:
    //                     session.isActive,
    //             }
    //         },
    //     )

    //     return success(
    //         live_tracking,
    //         'Live Tracking Fetched',
    //         'Visitor live tracking fetched successfully',
    //     )
    // }

    // async getLiveTracking() {
    //     const sessions =
    //         await this.prisma.trackingSession.findMany({
    //             where: {
    //                 isActive: true,
    //             },

    //             include: {
    //                 visitor: true,

    //                 locations: {
    //                     orderBy: {
    //                         createdAt: 'asc',
    //                     },

    //                     take: 20,
    //                 },
    //             },
    //         })

    //     const live_tracking = sessions.map(
    //         (session) => {
    //             const latest =
    //                 session.locations[
    //                 session.locations.length - 1
    //                 ]

    //             return {
    //                 sessionId:
    //                     session.id,

    //                 visitorId:
    //                     session.visitor.id,

    //                 visitorName:
    //                     session.visitor.name,

    //                 latestLocation:
    //                     latest
    //                         ? {
    //                             latitude:
    //                                 latest.latitude,

    //                             longitude:
    //                                 latest.longitude,

    //                             accuracy:
    //                                 latest.accuracy,

    //                             updatedAt:
    //                                 latest.createdAt,
    //                         }
    //                         : null,

    //                 trail:
    //                     session.locations.map(
    //                         (loc) => ({
    //                             latitude:
    //                                 loc.latitude,

    //                             longitude:
    //                                 loc.longitude,
    //                         }),
    //                     ),

    //                 isActive:
    //                     session.isActive,
    //             }
    //         },
    //     )

    //     return success(
    //         live_tracking,
    //         'Live Tracking Fetched',
    //         'Visitor live tracking fetched successfully',
    //     )
    // }

    async getLiveTracking() {
        const sessions =
            await this.prisma.trackingSession.findMany({
                where: {
                    isActive: true,
                },

                include: {
                    visitor: true,
                },
            })

        const live_tracking =
            sessions.map((session) => ({
                sessionId:
                    session.id,

                visitorId:
                    session.visitor.id,

                visitorName:
                    session.visitor.name,

                latitude:
                    session.currentLat,

                longitude:
                    session.currentLng,

                updatedAt:
                    session.lastLocationAt,

                isActive:
                    session.isActive,
            }))

        return success(
            live_tracking,
            'Live Tracking Fetched',
            'Visitor live tracking fetched successfully',
        )
    }

    async stopTracking(
        sessionId: string,
    ) {
        return this.prisma.trackingSession.update({
            where: {
                id: sessionId,
            },

            data: {
                isActive: false,

                endedAt:
                    new Date(),
            },
        })
    }

    async getTrackingHistory(
        sessionId: string,
    ) {
        return this.prisma.visitorLocation.findMany({
            where: {
                trackingSessionId:
                    sessionId,
            },

            orderBy: {
                createdAt: 'asc',
            },

            take: 1000,
        })
    }
}