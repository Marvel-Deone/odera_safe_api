import {
    HttpStatus,
    Injectable,
} from '@nestjs/common'

import {
    GateAction,
    LogCategory,
    Role,
    VisitorStatus,
} from '@prisma/client'

import * as bcrypt from 'bcrypt'

import { PrismaService } from '../../database/prisma/prisma.service'

import {
    error,
    success,
} from '../../common/utils/response.util'

@Injectable()
export class GuardService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async createGuard(
        userId: string,
        dto: any,
    ) {
        const admin =
            // await this.prisma.admin.findFirst({
            await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const existingUser =
            await this.prisma.user.findFirst({
                where: {
                    email: dto.email,
                },
            })

        if (existingUser) {
            return error(
                'Conflict',
                'User already exists',
                HttpStatus.CONFLICT,
            )
        }

        const tempPassword =
            this.generateTempPassword()

        const hashedPassword =
            await bcrypt.hash(
                tempPassword,
                10,
            )

        const user =
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password:
                        hashedPassword,
                    role: Role.GUARD,
                    first_login: true,
                    estateId: admin.estateId,
                },
            })

        const guard =
            await this.prisma.guard.create({
                data: {
                    userId: user.id,
                    estateId:
                        admin.estateId,

                    role: dto.role,

                    full_name:
                        dto.full_name,

                    phone: dto.phone,

                    email: dto.email,

                    zone_assignment:
                        dto.zone_assignment,

                    shift_pattern:
                        dto.shift_pattern,

                    duty_cycle:
                        dto.duty_cycle,

                    resumption_date:
                        dto.resumption_date
                            ? new Date(
                                dto.resumption_date,
                            )
                            : null,

                    government_id_type:
                        dto.government_id_type,

                    government_id_no:
                        dto.government_id_no,

                    nin: dto.nin,

                    height:
                        dto.height,

                    build:
                        dto.build,

                    distinguishing_marks:
                        dto.distinguishing_marks,

                    nok_name:
                        dto.nok_name,

                    nok_phone:
                        dto.nok_phone,

                    nok_relationship:
                        dto.nok_relationship,

                    guarantor_name:
                        dto.guarantor_name,

                    guarantor_phone:
                        dto.guarantor_phone,

                    guarantor_occupation:
                        dto.guarantor_occupation,

                    guarantor_work_address:
                        dto.guarantor_work_address,

                    guarantor_nin:
                        dto.guarantor_nin,

                    guarantor_relationship:
                        dto.guarantor_relationship,

                    salary_band:
                        dto.salary_band,

                    bank_name:
                        dto.bank_name,

                    account_number:
                        dto.account_number,

                    account_name:
                        dto.account_name,

                    first_aid:
                        dto.first_aid ??
                        false,

                    fire_safety:
                        dto.fire_safety ??
                        false,

                    qr_gate_ops:
                        dto.qr_gate_ops ??
                        false,

                    biometric_capture:
                        dto.biometric_capture ??
                        false,

                    crisis_response:
                        dto.crisis_response ??
                        false,

                    female_screening:
                        dto.female_screening ??
                        false,

                    self_defence:
                        dto.self_defence ??
                        false,

                    cctv_operation:
                        dto.cctv_operation ??
                        false,
                },
            })

        await this.createActivityLog({
            estateId:
                admin.estateId,

            category:
                LogCategory.SECURITY,

            action: 'GUARD_CREATED',

            description: `Guard profile created for ${guard.full_name}`,

            actorId: userId,

            actorRole:
                Role.ADMIN,

            metadata: {
                guardId: guard.id,
            },
        })

        return success(
            {
                guard,
                temporaryPassword:
                    tempPassword,
            },
            'Guard Created',
            'Guard created successfully',
        )
    }

    async getGuards(
        userId: string,
    ) {
        const admin =
            await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guards =
            await this.prisma.guard.findMany({
                where: {
                    estateId:
                        admin.estateId,
                },

                include: {
                    user: true,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            guards,
            'Guards Retrieved',
            'Guards fetched successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | ADMIN: GET SINGLE GUARD
  |--------------------------------------------------------------------------
  */

    async getGuardById(
        userId: string,
        guardId: string,
    ) {
        const admin =
            await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guard =
            await this.prisma.guard.findFirst({
                where: {
                    id: guardId,
                    estateId:
                        admin.estateId,
                },

                include: {
                    user: true,
                    gateLogs: {
                        take: 20,
                        orderBy: {
                            createdAt:
                                'desc',
                        },
                    },
                },
            })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            guard,
            'Guard Retrieved',
            'Guard fetched successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | ADMIN: SUSPEND GUARD
  |--------------------------------------------------------------------------
  */

    async suspendGuard(
        userId: string,
        guardId: string,
    ) {
        const admin =
            await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guard =
            await this.prisma.guard.findFirst({
                where: {
                    id: guardId,
                    estateId:
                        admin.estateId,
                },
            })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        await this.prisma.guard.update({
            where: {
                userId: guard.userId,
            },

            data: {
                is_active: false,
            },
        })

        return success(
            null,
            'Guard Suspended',
            'Guard suspended successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | ADMIN: ACTIVATE GUARD
  |--------------------------------------------------------------------------
  */

    async activateGuard(
        userId: string,
        guardId: string,
    ) {
        const admin =
            await this.prisma.user.findFirst({
                where: {
                    id: userId,
                },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guard =
            await this.prisma.guard.findFirst({
                where: {
                    id: guardId,
                    estateId:
                        admin.estateId,
                },
            })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        await this.prisma.guard.update({
            where: {
                userId: guard.userId,
            },

            data: {
                is_active: true,
            },
        })

        return success(
            null,
            'Guard Activated',
            'Guard activated successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | DASHBOARD
  |--------------------------------------------------------------------------
  */

    async getDashboard(
        userId: string,
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

        const [
            pendingVisitors,
            checkedInVisitors,
            checkedOutVisitors,
            revokedVisitors,
            expiredVisitors,
            recentLogs,
        ] = await Promise.all([
            this.prisma.visitor.count({
                where: {
                    estateId: guard.estateId,
                    status:
                        VisitorStatus.PENDING,
                },
            }),

            this.prisma.visitor.count({
                where: {
                    estateId: guard.estateId,
                    status:
                        VisitorStatus.CHECKED_IN,
                },
            }),

            this.prisma.visitor.count({
                where: {
                    estateId: guard.estateId,
                    status:
                        VisitorStatus.CHECKED_OUT,
                },
            }),

            this.prisma.visitor.count({
                where: {
                    estateId: guard.estateId,
                    status:
                        VisitorStatus.REVOKED,
                },
            }),

            this.prisma.visitor.count({
                where: {
                    estateId: guard.estateId,
                    status:
                        VisitorStatus.EXPIRED,
                },
            }),

            this.prisma.activityLog.findMany({
                where: {
                    estateId: guard.estateId,
                    category:
                        LogCategory.VISITOR,
                },

                orderBy: {
                    createdAt: 'desc',
                },

                take: 20,
            }),
        ])

        return success(
            {
                pendingVisitors,
                checkedInVisitors,
                checkedOutVisitors,
                revokedVisitors,
                expiredVisitors,
                recentLogs,
            },
            'Dashboard Retrieved',
            'Guard dashboard fetched successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | ACTIVITY FEED
  |--------------------------------------------------------------------------
  */

    // async getActivityFeed(
    //     userId: string,
    // ) {
    //     const guard =
    //         await this.prisma.guard.findFirst({
    //             where: {
    //                 userId,
    //             },
    //         })

    //     if (!guard) {
    //         return error(
    //             'Not Found',
    //             'Guard not found',
    //             HttpStatus.NOT_FOUND,
    //         )
    //     }

    //     const logs =
    //         await this.prisma.activityLog.findMany({
    //             where: {
    //                 estateId: guard.estateId,
    //                 category:
    //                     LogCategory.VISITOR,
    //             },

    //             orderBy: {
    //                 createdAt: 'desc',
    //             },

    //             take: 50,
    //         })

    //     return success(
    //         logs,
    //         'Activity Feed Retrieved',
    //         'Gate activity feed fetched successfully',
    //     )
    // }

    async getActivityFeed(
        userId: string,
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

        // Fetch raw logs
        const logs =
            await this.prisma.activityLog.findMany({
                where: {
                    estateId: guard.estateId,

                    category:
                        LogCategory.VISITOR,

                    action: {
                        in: [
                            'VISITOR_QR_SCANNED',
                            'VISITOR_CHECKED_IN',
                            'VISITOR_CHECKED_OUT',
                            'VISITOR_DENIED',
                            'VISITOR_REVOKED',
                        ],
                    },
                },

                orderBy: {
                    createdAt: 'desc',
                },

                take: 50,
            })

        // Remove excessive duplicate QR scans
        const filteredLogs =
            logs.filter(
                (log, index, arr) => {
                    if (
                        log.action !==
                        'VISITOR_QR_SCANNED'
                    ) {
                        return true
                    }

                    const previous =
                        arr[index - 1]

                    if (!previous) {
                        return true
                    }

                    const sameVisitor =
                        previous.metadata?.[
                        'visitorId'
                        ] ===
                        log.metadata?.[
                        'visitorId'
                        ]

                    const sameAction =
                        previous.action ===
                        log.action

                    const withinOneMinute =
                        Math.abs(
                            new Date(
                                previous.createdAt,
                            ).getTime() -
                            new Date(
                                log.createdAt,
                            ).getTime(),
                        ) <
                        1000 * 60

                    return !(
                        sameVisitor &&
                        sameAction &&
                        withinOneMinute
                    )
                },
            )

        // Extract visitor IDs
        const visitorIds = [
            ...new Set(
                filteredLogs
                    .map(
                        (log) =>
                            (
                                log.metadata as any
                            )?.visitorId,
                    )
                    .filter(Boolean),
            ),
        ]

        // Fetch visitors + resident
        const visitors =
            await this.prisma.visitor.findMany({
                where: {
                    id: {
                        in: visitorIds,
                    },
                },

                include: {
                    resident: true,
                },
            })

        // Create lookup map
        const visitorMap = new Map(
            visitors.map((visitor) => [
                visitor.id,
                visitor,
            ]),
        )

        // Enrich logs
        const enrichedLogs =
            filteredLogs.map((log) => {
                const visitorId = (
                    log.metadata as any
                )?.visitorId

                const visitor =
                    visitorMap.get(visitorId)

                return {
                    ...log,

                    visitor: visitor
                        ? {
                            id: visitor.id,

                            name:
                                visitor.name,

                            purpose:
                                visitor.purpose,

                            plateNo:
                                visitor.plate_no,

                            status:
                                visitor.status,

                            residentName:
                                visitor
                                    .resident
                                    ?.home_address,

                            houseNumber:
                                visitor
                                    .resident
                                    ?.house_no,
                        }
                        : null,
                }
            })

        return success(
            enrichedLogs,
            'Activity Feed Retrieved',
            'Gate activity feed fetched successfully',
        )
    }

    async getGateQueue(userId: string) {
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

        const queue =
            await this.prisma.gateQueue.findMany({
                where: {
                    estateId: guard.estateId,
                    status: 'WAITING',
                },

                include: {
                    visitor: {
                        include: {
                            resident: true,
                        },
                    },
                },

                orderBy: {
                    scannedAt: 'asc',
                },
            })

        return success(
            queue,
            'Queue Retrieved',
            'Gate queue fetched successfully',
        )
    }

    /*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

    private generateTempPassword() {
        return Math.random()
            .toString(36)
            .slice(-8)
    }

    private async createActivityLog(
        data: {
            estateId: string
            category: LogCategory
            action: string
            description: string
            actorId?: string
            actorRole?: Role
            metadata?: any
        },
    ) {
        return this.prisma.activityLog.create({
            data,
        })
    }
}