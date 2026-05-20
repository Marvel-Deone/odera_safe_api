import {
    HttpStatus,
    Injectable,
} from '@nestjs/common'

import {
    GateAction,
    GuardRole,
    IncidentStatus,
    LogCategory,
    Role,
    ShiftStatus,
    ShiftType,
    VisitorStatus,
} from '@prisma/client'

import * as bcrypt from 'bcrypt'
import * as QRCode from 'qrcode'
import * as crypto from 'crypto'

import { PrismaService } from '../../database/prisma/prisma.service'

import {
    error,
    success,
} from '../../common/utils/response.util'
import { CreateIncidentDto } from './dto/create-incident.dto'

@Injectable()
export class GuardService {
    constructor(private prisma: PrismaService,) { }

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

                    guardShifts: {
                        // where: {
                        //     status: 'ONGOING',
                        // },

                        // take: 1,

                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        const formattedGuards = guards.map((guard) => ({
            ...guard,
            currentShift: guard.guardShifts[0] || null,
        }))

        return success(
            formattedGuards,
            'Guards Retrieved',
            'Guards fetched successfully',
        )
    }

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

        const guard = await this.prisma.guard.findFirst({
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

    async updateGuard(
        userId: string,
        guardId: string,
        dto: any,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const existingGuard =
            await this.prisma.guard.findFirst({
                where: {
                    id: guardId,
                    estateId: admin.estateId,
                },
            })

        if (!existingGuard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guard =
            await this.prisma.guard.update({
                where: {
                    id: guardId,
                },
                data: {
                    ...dto,
                    resumption_date:
                        dto.resumption_date
                            ? new Date(dto.resumption_date)
                            : undefined,
                },
                include: {
                    user: true,
                },
            })

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'GUARD_UPDATED',
            description: `Guard profile updated for ${guard.full_name}`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                guardId: guard.id,
            },
        })

        return success(
            guard,
            'Guard Updated',
            'Guard updated successfully',
        )
    }

    async promoteGuard(
        userId: string,
        guardId: string,
        dto?: { role?: GuardRole },
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        // Only Admin or Super Admin
        if (
            admin.role !== Role.ADMIN &&
            admin.role !== Role.SUPER_ADMIN
        ) {
            return error(
                'Forbidden',
                'You are not allowed to promote guards',
                HttpStatus.FORBIDDEN,
            )
        }

        const guard = await this.prisma.guard.findFirst({
            where: {
                id: guardId,
                estateId: admin.estateId,
            },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (!guard.is_active) {
            return error(
                'Invalid Operation',
                'Cannot promote inactive guard',
                HttpStatus.BAD_REQUEST,
            )
        }

        // Determine new role
        let newRole: GuardRole

        if (dto?.role) {
            newRole = dto.role
        } else {
            // Toggle role
            newRole =
                guard.role === GuardRole.GUARD
                    ? GuardRole.SUPER_GUARD
                    : GuardRole.GUARD
        }

        // Prevent invalid promotions
        if (
            newRole !== GuardRole.GUARD &&
            newRole !== GuardRole.SUPER_GUARD
        ) {
            return error(
                'Invalid Role',
                'Invalid guard role',
                HttpStatus.BAD_REQUEST,
            )
        }

        const updatedGuard =
            await this.prisma.guard.update({
                where: { id: guardId },
                data: {
                    role: newRole,
                },
            })

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'GUARD_PROMOTED',
            description: `${guard.full_name} is now ${newRole}`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                guardId: guard.id,
                previousRole: guard.role,
                newRole,
            },
        })

        return success(
            updatedGuard,
            'Guard Updated',
            `Guard role updated to ${newRole}`,
        )
    }

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

    async getWeeklySchedule(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const startOfWeek = new Date()
        startOfWeek.setHours(0, 0, 0, 0)

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 7)

        const shifts = await this.prisma.guardShift.findMany({
            where: {
                estateId: admin.estateId,
                shiftDate: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            },
            include: {
                guard: true,
            },
            orderBy: {
                shiftDate: 'asc',
            },
        })

        return success(shifts, 'Schedule Retrieved', 'Weekly guard schedule fetched successfully', HttpStatus.OK)
    }

    async assignShift(userId: string, dto: any) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guard = await this.prisma.guard.findFirst({
            where: {
                id: dto.guardId,
                estateId: admin.estateId,
            },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const shift = await this.prisma.guardShift.create({
            data: {
                guardId: guard.id,
                estateId: admin.estateId,

                shiftDate: new Date(dto.date),
                shiftType: dto.shiftType,

                startTime: new Date(dto.startTime),
                endTime: new Date(dto.endTime),
            },
        })

        return success(shift, 'Shift assigned', 'Guard shift assigned successfully', HttpStatus.OK)
    }

    async generateWeeklySchedule(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const guards = await this.prisma.guard.findMany({
            where: {
                estateId: admin.estateId,
                is_active: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        if (!guards.length) {
            return error(
                'Not Found',
                'No guards found',
                HttpStatus.NOT_FOUND,
            )
        }

        const shiftPattern: ShiftType[] = [
            ShiftType.DAY,
            ShiftType.DAY,
            ShiftType.NIGHT,
            ShiftType.NIGHT,
            ShiftType.REST,
            ShiftType.STANDBY,
            ShiftType.REST,
        ]

        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)

        const shiftsToCreate: Array<{
            guardId: string
            estateId: string
            shiftDate: Date
            shiftType: typeof ShiftType[keyof typeof ShiftType]
            startTime: Date
            endTime: Date
        }> = []

        for (let i = 0; i < guards.length; i++) {
            const guard = guards[i]

            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate)
                date.setDate(startDate.getDate() + day)

                const shiftType =
                    shiftPattern[(i + day) % shiftPattern.length]

                let startTime = new Date(date)
                let endTime = new Date(date)

                if (shiftType === ShiftType.DAY) {
                    startTime.setHours(8, 0, 0)
                    endTime.setHours(20, 0, 0)
                }

                if (shiftType === ShiftType.NIGHT) {
                    startTime.setHours(20, 0, 0)
                    endTime.setDate(endTime.getDate() + 1)
                    endTime.setHours(8, 0, 0)
                }

                if (
                    shiftType === ShiftType.REST ||
                    shiftType === ShiftType.STANDBY
                ) {
                    startTime.setHours(0, 0, 0)
                    endTime.setHours(0, 0, 0)
                }

                shiftsToCreate.push({
                    guardId: guard.id,
                    estateId: admin.estateId,
                    shiftDate: date,
                    shiftType,
                    startTime,
                    endTime,
                })
            }
        }

        // clear existing week
        await this.prisma.guardShift.deleteMany({
            where: {
                estateId: admin.estateId,
                shiftDate: {
                    gte: startDate,
                },
            },
        })

        await this.prisma.guardShift.createMany({
            data: shiftsToCreate,
        })

        return success(
            shiftsToCreate.length,
            'Schedule Generated',
            'Weekly guard schedule created successfully',
        )
    }

    async getMyRoster(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const shifts = await this.prisma.guardShift.findMany({
            where: {
                guardId: guard.id,
                shiftDate: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
            orderBy: {
                shiftDate: 'asc',
            },
        })

        return success(
            shifts,
            'Roster Retrieved',
            'Your roster fetched successfully',
        )
    }

    async getUpcomingResumptions(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const next7Days = new Date(today)
        next7Days.setDate(next7Days.getDate() + 7)

        const guards = await this.prisma.guard.findMany({
            where: {
                estateId: admin.estateId,
                is_active: true,
                resumption_date: {
                    not: null,
                    lte: next7Days,
                },
            },
            orderBy: {
                resumption_date: 'asc',
            },
            select: {
                id: true,
                full_name: true,
                phone: true,
                zone_assignment: true,
                shift_pattern: true,
                resumption_date: true,
                role: true,
            },
        })

        return success(
            guards,
            'Upcoming Resumptions',
            'Upcoming resumption dates fetched successfully',
        )
    }

    async clockIn(userId: string, dto: any) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error('Guard not found')
        }

        const now = new Date()

        const shift = await this.prisma.guardShift.findFirst({
            where: {
                guardId: guard.id,
                shiftDate: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        })

        if (!shift) {
            return error('No shift scheduled today')
        }

        if (shift.status === 'ONGOING') {
            return error('Already clocked in')
        }

        // Calculate lateness
        let minutesLate = 0

        if (shift.startTime && now > shift.startTime) {
            minutesLate = Math.floor(
                (now.getTime() - shift.startTime.getTime()) / 60000,
            )
        }

        const attendanceStatus =
            minutesLate > 0 ? 'LATE' : 'PRESENT'

        // Update shift
        await this.prisma.guardShift.update({
            where: { id: shift.id },
            data: {
                status: 'ONGOING',
            },
        })

        // Create / update attendance
        await this.prisma.guardAttendance.upsert({
            where: { shiftId: shift.id },
            update: {
                clockInAt: now,
                clockInLatitude: dto.latitude,
                clockInLongitude: dto.longitude,
                clockInPhotoUrl: dto.photo,
                minutesLate,
                attendanceStatus,
                status: attendanceStatus,
            },
            create: {
                shiftId: shift.id,
                guardId: guard.id,
                clockInAt: now,
                clockInLatitude: dto.latitude,
                clockInLongitude: dto.longitude,
                clockInPhotoUrl: dto.photo,
                minutesLate,
                attendanceStatus,
                status: attendanceStatus,
            },
        })

        return success(
            {
                minutesLate,
                status: attendanceStatus,
            },
            'Clock In Successful',
            'You are now on duty',
            HttpStatus.OK
        )
    }

    async clockOut(userId: string, dto: any) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) return error('Guard not found')

        const shift = await this.prisma.guardShift.findFirst({
            where: {
                guardId: guard.id,
                status: 'ONGOING',
            },
        })

        if (!shift) {
            return error('No active shift')
        }

        const now = new Date()

        const attendance =
            await this.prisma.guardAttendance.findUnique({
                where: { shiftId: shift.id },
            })

        let minutesWorked = 0

        if (attendance?.clockInAt) {
            minutesWorked = Math.floor(
                (now.getTime() - attendance.clockInAt.getTime()) /
                60000,
            )
        }

        await this.prisma.guardShift.update({
            where: { id: shift.id },
            data: {
                status: 'COMPLETED',
            },
        })

        await this.prisma.guardAttendance.update({
            where: { shiftId: shift.id },
            data: {
                clockOutAt: now,
                clockOutLatitude: dto.latitude,
                clockOutLongitude: dto.longitude,
                clockOutPhotoUrl: dto.photo,
                minutesWorked,
            },
        })

        return success(
            { minutesWorked },
            'Clock Out Successful',
            'Shift completed',
        )
    }

    async autoShiftRunner() {
        const now = new Date()

        await this.prisma.guardShift.updateMany({
            where: {
                startTime: { lte: now },
                endTime: { gte: now },
                status: 'SCHEDULED',
            },
            data: {
                status: 'ONGOING',
            },
        })
    }

    async getOnDutyGuards(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) return error('Unauthorized')

        const shifts = await this.prisma.guardShift.findMany({
            where: {
                estateId: admin.estateId,
                status: 'ONGOING',
            },
            include: {
                guard: true,
                attendance: true,
            },
        })

        const data = shifts.map((s) => ({
            guardId: s.guard.id,
            name: s.guard.full_name,
            zone: s.zone || s.guard.zone_assignment,
            shiftType: s.shiftType,
            clockIn: s.attendance?.clockInAt,
            minutesLate: s.attendance?.minutesLate || 0,
        }))

        return success(
            data,
            'On Duty Guards',
            'Guards currently on duty',
        )
    }

    async getAttendance(userId: string) {
        const admin = await this.prisma.user.findFirst({
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

        const attendance =
            await this.prisma.guardAttendance.findMany({
                where: {
                    guard: {
                        estateId: admin.estateId,
                    },
                },

                include: {
                    guard: {
                        select: {
                            id: true,
                            full_name: true,
                            role: true,
                            zone_assignment: true,
                        },
                    },

                    shift: {
                        select: {
                            id: true,
                            shiftDate: true,
                            shiftType: true,
                            startTime: true,
                            endTime: true,
                            status: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        const formatted = attendance.map((record) => ({
            id: record.id,

            guardId: record.guard.id,
            guardName: record.guard.full_name,
            guardRole: record.guard.role,
            zone: record.guard.zone_assignment,

            shiftDate: record.shift.shiftDate,
            shiftType: record.shift.shiftType,
            scheduledStart: record.shift.startTime,
            scheduledEnd: record.shift.endTime,

            clockInAt: record.clockInAt,
            clockOutAt: record.clockOutAt,

            minutesLate:
                record.minutesLate ?? 0,

            minutesWorked:
                record.minutesWorked ?? 0,

            attendanceStatus:
                record.attendanceStatus ??
                record.status,

            handoverNotes:
                record.handoverNotes,

            createdAt: record.createdAt,
        }))

        return success(
            formatted,
            'Attendance Logs Retrieved',
            'Attendance logs fetched successfully',
            HttpStatus.OK,
        )
    }

    async addHandover(
        userId: string,
        note: string,
    ) {
        const guard =
            await this.prisma.guard.findFirst({
                where: { userId },
            })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
            )
        }

        const shift =
            await this.prisma.guardShift.findFirst({
                where: {
                    guardId: guard.id,
                    status: 'ONGOING',
                },
            })

        if (!shift) {
            return error(
                'Invalid Operation',
                'No active shift found',
            )
        }

        const attendance =
            await this.prisma.guardAttendance.findUnique({
                where: {
                    shiftId: shift.id,
                },
            })

        if (!attendance) {
            return error(
                'Invalid Operation',
                'You must clock in before adding handover note',
            )
        }

        await this.prisma.guardAttendance.update({
            where: {
                shiftId: shift.id,
            },
            data: {
                handoverNotes: note,
            },
        })

        return success(
            null,
            'Handover Saved',
            'Handover note added successfully',
        )
    }

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

    async createIncident(
        userId: string,
        dto: CreateIncidentDto,
    ) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incident = await this.prisma.incident.create({
            data: {
                estateId: guard.estateId,
                guardId: guard.id,
                title: dto.title,
                category: dto.category,
                description: dto.description,
                severity: dto.severity,
                photos: dto.photos || [],
                occurredAt: dto.occurredAt
                    ? new Date(dto.occurredAt)
                    : new Date(),
            },
            include: {
                guard: true,
            },
        })

        await this.createActivityLog({
            estateId: guard.estateId,
            category: LogCategory.SECURITY,
            action: 'INCIDENT_REPORTED',
            description: `Incident reported: ${incident.title}`,
            actorId: userId,
            actorRole: Role.GUARD,
            metadata: {
                incidentId: incident.id,
                severity: incident.severity,
                category: incident.category,
            },
        })

        return success(
            incident,
            'Incident Reported',
            'Incident submitted successfully',
        )
    }

    // guard incident list
    async getMyIncidents(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incidents = await this.prisma.incident.findMany({
            where: {
                guardId: guard.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(
            incidents,
            'My Incidents',
            'Incident history retrieved successfully',
        )
    }

    // Admin incident list
    async getAllIncidents(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incidents = await this.prisma.incident.findMany({
            where: {
                estateId: admin.estateId,
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
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(
            incidents,
            'Incidents Retrieved',
            'Incident list fetched successfully',
        )
    }

    async getIncidentById(
        userId: string,
        incidentId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incident = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
            },
            include: {
                guard: true,
            },
        })

        if (!incident) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            incident,
            'Incident Retrieved',
            'Incident details fetched successfully',
        )
    }

    async updateIncidentStatus(
        userId: string,
        incidentId: string,
        dto: {
            status: IncidentStatus
            adminNotes?: string
        },
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const existing = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
            },
        })

        if (!existing) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incident = await this.prisma.incident.update({
            where: {
                id: incidentId,
            },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes,
            },
        })

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'INCIDENT_UPDATED',
            description: `Incident ${incident.title} marked ${dto.status}`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                incidentId,
                status: dto.status,
            },
        })

        return success(
            incident,
            'Incident Updated',
            'Incident status updated successfully',
        )
    }

    async createPatrolCheckpoint(
        userId: string,
        dto: any,
    ) {
        const admin =
            await this.prisma.user.findFirst({
                where: { id: userId },
            })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const checkpoint =
            await this.prisma.patrolCheckpoint.create({
                data: {
                    estateId: admin.estateId,

                    name: dto.name,
                    zone: dto.zone,
                    description: dto.description,

                    latitude: dto.latitude,
                    longitude: dto.longitude,

                    requiredFrequency:
                        dto.requiredFrequency,

                    qrCode: '',
                },
            })

        const qrPayload = {
            type: 'PATROL_CHECKPOINT',
            checkpointId: checkpoint.id,
        }

        const encodedPayload =
            Buffer.from(
                JSON.stringify(qrPayload),
            ).toString('base64')

        const qrCodeImage =
            await QRCode.toDataURL(
                encodedPayload,
                {
                    width: 800,
                    margin: 2,

                    color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                    },
                },
            )

        const updatedCheckpoint =
            await this.prisma.patrolCheckpoint.update({
                where: {
                    id: checkpoint.id,
                },

                data: {
                    qrCode: qrCodeImage,
                },
            })

        return success(
            updatedCheckpoint,
            'Checkpoint Created',
            'Patrol checkpoint created successfully',
        )
    }

    async getPatrolCheckpoints(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const checkpoints =
            await this.prisma.patrolCheckpoint.findMany({
                where: {
                    estateId: admin.estateId,
                },
                include: {
                    scans: {
                        take: 1,
                        orderBy: {
                            scannedAt: 'desc',
                        },
                        include: {
                            guard: {
                                select: {
                                    id: true,
                                    full_name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })

        const formatted = checkpoints.map((checkpoint) => ({
            ...checkpoint,
            lastScan: checkpoint.scans[0] || null,
        }))

        return success(
            formatted,
            'Patrol Checkpoints',
            'Patrol checkpoints fetched successfully',
        )
    }

    async getPatrolCheckpointById(
        userId: string,
        checkpointId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const checkpoint =
            await this.prisma.patrolCheckpoint.findFirst({
                where: {
                    id: checkpointId,
                    estateId: admin.estateId,
                },
                include: {
                    scans: {
                        include: {
                            guard: {
                                select: {
                                    id: true,
                                    full_name: true,
                                    zone_assignment: true,
                                },
                            },
                        },
                        orderBy: {
                            scannedAt: 'desc',
                        },
                        take: 50,
                    },
                    patrolAlerts: {
                        where: {
                            resolved: false,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                },
            })

        if (!checkpoint) {
            return error(
                'Not Found',
                'Checkpoint not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            checkpoint,
            'Patrol Checkpoint',
            'Checkpoint fetched successfully',
        )
    }

    async scanPatrolCheckpoint(
        userId: string,
        dto: {
            qrCode: string
            latitude?: number
            longitude?: number
            notes?: string
        },
    ) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        let decoded

        try {
            const json = Buffer.from(
                dto.qrCode,
                'base64',
            ).toString('utf-8')

            decoded = JSON.parse(json)
        } catch {
            return error(
                'Invalid QR',
                'Malformed checkpoint QR code',
                HttpStatus.BAD_REQUEST,
            )
        }

        const { checkpointId } = decoded

        if (!checkpointId) {
            return error(
                'Invalid QR',
                'Checkpoint ID missing',
                HttpStatus.BAD_REQUEST,
            )
        }

        const checkpoint =
            await this.prisma.patrolCheckpoint.findFirst({
                where: {
                    id: checkpointId,
                    estateId: guard.estateId,
                    isActive: true,
                },
            })

        if (!checkpoint) {
            return error(
                'Invalid QR Code',
                'Checkpoint not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const activeShift =
            await this.prisma.guardShift.findFirst({
                where: {
                    guardId: guard.id,
                    status: ShiftStatus.ONGOING,
                },
            })

        const scan = await this.prisma.patrolScan.create({
            data: {
                guardId: guard.id,
                checkpointId: checkpoint.id,
                shiftId: activeShift?.id,
                estateId: guard.estateId,
                latitude: dto.latitude,
                longitude: dto.longitude,
                notes: dto.notes,
                isValid: true,
            },
            include: {
                checkpoint: true,
            },
        })

        await this.prisma.missedCheckpointAlert.updateMany({
            where: {
                checkpointId: checkpoint.id,
                status: 'ACTIVE',
            },

            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
            },
        })

        return success(
            scan,
            'Checkpoint Scanned',
            'Patrol scan recorded successfully',
        )
    }

    async getMyPatrolLog(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const scans = await this.prisma.patrolScan.findMany({
            where: {
                guardId: guard.id,
            },
            include: {
                checkpoint: true,
                shift: true,
            },
            orderBy: {
                scannedAt: 'desc',
            },
            take: 100,
        })

        return success(
            scans,
            'Patrol Log',
            'Patrol log fetched successfully',
        )
    }

    async getPatrolScans(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const scans = await this.prisma.patrolScan.findMany({
            where: {
                estateId: admin.estateId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
                checkpoint: {
                    select: {
                        id: true,
                        name: true,
                        zone: true,
                    },
                },
                shift: {
                    select: {
                        id: true,
                        shiftType: true,
                        shiftDate: true,
                    },
                },
            },
            orderBy: {
                scannedAt: 'desc',
            },
            take: 200,
        })

        return success(
            scans,
            'Patrol Scans',
            'Patrol scans fetched successfully',
        )
    }

    async getPatrolAlerts(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const alerts = await this.prisma.patrolAlert.findMany({
            where: {
                estateId: admin.estateId,
            },
            include: {
                checkpoint: {
                    select: {
                        id: true,
                        name: true,
                        zone: true,
                    },
                },
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(
            alerts,
            'Patrol Alerts',
            'Patrol alerts fetched successfully',
        )
    }

    async getSecurityOverview(userId: string) {
        const admin = await this.prisma.user.findFirst({
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

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // ACTIVE MISSED ALERTS
        const missedAlerts =
            await this.prisma.missedCheckpointAlert.findMany({
                where: {
                    estateId: admin.estateId,
                    status: 'ACTIVE',
                },

                include: {
                    checkpoint: true,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        //  TODAY SCANS
        const todayScans =
            await this.prisma.patrolScan.count({
                where: {
                    estateId: admin.estateId,

                    scannedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },
            })

        //  ACTIVE SHIFTS
        const activeShifts =
            await this.prisma.guardShift.count({
                where: {
                    estateId: admin.estateId,
                    status: ShiftStatus.ONGOING,
                },
            })

        //  GUARDS ON PATROL
        const guardsOnPatrol =
            await this.prisma.guardShift.findMany({
                where: {
                    estateId: admin.estateId,
                    status: ShiftStatus.ONGOING,
                },

                include: {
                    guard: true,
                },
            })

        //  TODAY PATROL SCANS
        const scansToday =
            await this.prisma.patrolScan.findMany({
                where: {
                    estateId: admin.estateId,

                    scannedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },

                include: {
                    checkpoint: true,
                    guard: true,
                },

                orderBy: {
                    scannedAt: 'desc',
                },

                take: 10,
            })

        //  TOTAL CHECKPOINTS
        const totalCheckpoints =
            await this.prisma.patrolCheckpoint.count({
                where: {
                    estateId: admin.estateId,
                    isActive: true,
                },
            })

        //  CHECKPOINTS VISITED TODAY
        const scannedCheckpointIds =
            await this.prisma.patrolScan.findMany({
                where: {
                    estateId: admin.estateId,

                    scannedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                },

                distinct: ['checkpointId'],

                select: {
                    checkpointId: true,
                },
            })

        const patrolCompletionRate =
            totalCheckpoints === 0
                ? 0
                : Math.round(
                    (scannedCheckpointIds.length /
                        totalCheckpoints) *
                    100,
                )

        //  OVERDUE ZONES
        const overdueZones =
            missedAlerts.map((alert) => {
                const expectedAt = new Date(alert.expectedAt)

                const minsOverdue = Math.floor(
                    (Date.now() -
                        expectedAt.getTime()) /
                    60000,
                )

                return {
                    id: alert.id,
                    checkpointId: alert.checkpointId,
                    zone: alert.checkpoint.zone,
                    checkpoint: alert.checkpoint.name,
                    overdueMinutes: minsOverdue,
                    expectedAt: alert.expectedAt,
                }
            })

        //  RECENT PATROL ACTIVITY
        const recentPatrolActivity =
            scansToday.map((scan) => ({
                id: scan.id,
                guardName: scan.guard.full_name,
                checkpoint: scan.checkpoint.name,
                zone: scan.checkpoint.zone,
                scannedAt: scan.scannedAt,
            }))

        return success(
            {
                stats: {
                    missedCheckpoints: missedAlerts.length,
                    patrolCompletionRate,
                    guardsOnPatrol: guardsOnPatrol.length,
                    todayScans,
                    activeShifts,
                },
                overdueZones,
                missedAlerts,
                recentPatrolActivity,
            },

            'Security Overview Retrieved',
            'Dashboard security overview fetched successfully',
        )
    }

    async getGuardPatrolDashboard(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const checkpoints =
            await this.prisma.patrolCheckpoint.findMany({
                where: {
                    estateId: guard.estateId,
                    isActive: true,
                },

                include: {
                    scans: {
                        where: {
                            guardId: guard.id,
                        },

                        orderBy: {
                            scannedAt: 'desc',
                        },

                        take: 1,
                    },
                },
            })

        const activeAlerts =
            await this.prisma.missedCheckpointAlert.findMany({
                where: {
                    estateId: guard.estateId,
                    status: 'ACTIVE',
                },

                include: {
                    checkpoint: true,
                },
            })

        const formattedCheckpoints =
            checkpoints.map((checkpoint, index) => {
                const latestScan =
                    checkpoint.scans[0]

                const hasAlert =
                    activeAlerts.find(
                        (a) =>
                            a.checkpointId ===
                            checkpoint.id,
                    )

                let status = 'upcoming'

                if (hasAlert) {
                    status = 'missed'
                } else if (latestScan) {
                    status = 'completed'
                }

                return {
                    id: checkpoint.id,
                    name: checkpoint.name,

                    status,

                    scheduledTime:
                        checkpoint.requiredFrequency,

                    scannedAt:
                        latestScan?.scannedAt || null,

                    overdueMinutes:
                        hasAlert
                            ? Math.floor(
                                (Date.now() -
                                    new Date(
                                        hasAlert.expectedAt,
                                    ).getTime()) /
                                60000,
                            )
                            : null,
                }
            })

        const completed =
            formattedCheckpoints.filter(
                (c) => c.status === 'completed',
            ).length

        const missed =
            formattedCheckpoints.filter(
                (c) => c.status === 'missed',
            ).length

        const completionRate =
            checkpoints.length === 0
                ? 0
                : Math.round(
                    (completed /
                        checkpoints.length) *
                    100,
                )

        const score =
            Math.max(
                0,
                completionRate - missed * 5,
            )

        const patrolWarning =
            activeAlerts.length > 0
                ? {
                    checkpoint:
                        activeAlerts[0].checkpoint.name,

                    overdueMinutes:
                        Math.floor(
                            (Date.now() -
                                new Date(
                                    activeAlerts[0].expectedAt,
                                ).getTime()) /
                            60000,
                        ),
                }
                : null

        return success(
            {
                patrolWarning,

                checkpoints:
                    formattedCheckpoints,

                performance: {
                    score,
                    completionRate,
                    completed,
                    missed,

                    label:
                        score >= 90
                            ? 'Top Performer'
                            : score >= 70
                                ? 'Good Standing'
                                : 'Needs Attention',
                },
            },

            'Guard Patrol Dashboard',
            'Guard patrol dashboard fetched successfully',
        )
    }
}