import {
    HttpStatus,
    Injectable,
} from '@nestjs/common'

import {
    GateAction,
    GuardRole,
    LogCategory,
    Role,
    ShiftType,
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
            where: { id: userId },
        })

        if (!admin) return error('Unauthorized')

        const logs =
            await this.prisma.guardAttendance.findMany({
                where: {
                    shift: {
                        estateId: admin.estateId,
                    },
                },
                include: {
                    guard: true,
                    shift: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            logs,
            'Attendance Logs',
            'Attendance retrieved successfully',
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
}