// import { Injectable } from '@nestjs/common'
// import { randomUUID } from 'crypto'
// import { PrismaService } from '../../database/prisma/prisma.service'
// import { UpdateLocationDto } from './dto/location.dto'

// @Injectable()
// export class TrackingService {
//     constructor(
//         private prisma: PrismaService,
//     ) { }

//     async startTracking(
//         visitorId: string,
//     ) {
//         const token =
//             randomUUID()

//         const session =
//             await this.prisma.trackingSession.create({
//                 data: {
//                     visitorId,
//                     token,
//                 },
//             })

//         return {
//             session,
//             trackingUrl: `${process.env.FRONTEND_URL}/visitor/live-tracking/${token}`,
//         }
//     }

//     async updateLocation(
//         dto: UpdateLocationDto,
//     ) {
//         return this.prisma.visitorLocation.create({
//             data: {
//                 trackingSessionId:
//                     dto.trackingSessionId,

//                 latitude:
//                     dto.latitude,

//                 longitude:
//                     dto.longitude,

//                 accuracy:
//                     dto.accuracy,
//             },
//         })
//     }

//     async getLiveTracking() {
//         const sessions =
//             await this.prisma.trackingSession.findMany({
//                 where: {
//                     isActive: true,
//                 },

//                 include: {
//                     visitor: true,

//                     locations: {
//                         orderBy: {
//                             createdAt: 'desc',
//                         },

//                         take: 1,
//                     },
//                 },
//             })

//         return sessions.map(
//             (session) => ({
//                 id: session.id,

//                 visitor:
//                     session.visitor.name,

//                 latestLocation:
//                     session.locations[0] || null,
//             }),
//         )
//     }

//     async stopTracking(
//         sessionId: string,
//     ) {
//         return this.prisma.trackingSession.update({
//             where: {
//                 id: sessionId,
//             },

//             data: {
//                 isActive: false,
//                 endedAt: new Date(),
//             },
//         })
//     }
// }

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
        return this.prisma.trackingSession.findFirst({
            where: {
                token,
                isActive: true,
            },

            include: {
                visitor: true,
            },
        })
    }

    async updateLocation(
        dto: UpdateLocationDto,
    ) {
        const session =
            await this.prisma.trackingSession.findFirst({
                where: {
                    token: dto.token,
                    isActive: true,
                },
            })

        if (!session) {
            return null
        }

        return this.prisma.visitorLocation.create({
            data: {
                trackingSessionId:
                    session.id,

                latitude:
                    dto.latitude,

                longitude:
                    dto.longitude,

                accuracy:
                    dto.accuracy,
            },
        })
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

    async getLiveTracking() {
        const sessions =
            await this.prisma.trackingSession.findMany({
                where: {
                    isActive: true,
                },

                include: {
                    visitor: true,

                    locations: {
                        orderBy: {
                            createdAt: 'asc',
                        },

                        take: 20,
                    },
                },
            })

        const live_tracking = sessions.map(
            (session) => {
                const latest =
                    session.locations[
                    session.locations.length - 1
                    ]

                return {
                    sessionId:
                        session.id,

                    visitorId:
                        session.visitor.id,

                    visitorName:
                        session.visitor.name,

                    latestLocation:
                        latest
                            ? {
                                latitude:
                                    latest.latitude,

                                longitude:
                                    latest.longitude,

                                accuracy:
                                    latest.accuracy,

                                updatedAt:
                                    latest.createdAt,
                            }
                            : null,

                    trail:
                        session.locations.map(
                            (loc) => ({
                                latitude:
                                    loc.latitude,

                                longitude:
                                    loc.longitude,
                            }),
                        ),

                    isActive:
                        session.isActive,
                }
            },
        )

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
}