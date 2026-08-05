import {
    HttpStatus,
    Injectable,
} from '@nestjs/common'

import {
    LogCategory,
    Prisma,
    Role,
    VisitorStatus,
} from '@prisma/client'

import * as QRCode from 'qrcode'

import dayjs from 'dayjs'

import { PrismaService } from '../../database/prisma/prisma.service'

import {
    error,
    success,
} from '../../common/utils/response.util'

import { CreateVisitorDto, UpdateVisitorDto } from './dto/visitor.dto'
import { TrackingService } from '../tracking/tracking.service'

@Injectable()
export class VisitorService {
    constructor(
        private prisma: PrismaService,
        private trackingService: TrackingService,
    ) { }

    private accompanyingVisitorsJson(visitors: CreateVisitorDto['accompanyingVisitors'] = []) {
        return visitors.map((visitor) => ({
            name: visitor.name,
            ageCategory: visitor.ageCategory,
            ...(visitor.phoneNumber !== undefined ? { phoneNumber: visitor.phoneNumber } : {}),
        })) as Prisma.InputJsonValue
    }

    // resident: create visitor
    async createVisitor(userId: string, dto: CreateVisitorDto,) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        // generate codes
        const passCode =
            this.generatePassCode()

        const smsCode =
            this.generateSMSCode()

        // qr payload
        const qrPayload = {
            visitorId: crypto.randomUUID(),
            passCode,
        }

        const encodedPayload =
            Buffer.from(
                JSON.stringify(qrPayload),
            ).toString('base64')

        const qrCodeImage =
            await QRCode.toDataURL(
                encodedPayload,
            )

        // Create visitor
        const visitor =
            await this.prisma.visitor.create({
                data: {
                    estateId: resident.estateId,
                    residentId: resident.id,

                    name: dto.name,
                    phone: dto.phone,
                    purpose: dto.purpose,

                    plate_no:
                        dto.plate_no || null,

                    hasAccompanyingVisitor:
                        dto.hasAccompanyingVisitor ??
                        false,

                    accompanyingVisitors:
                        dto.hasAccompanyingVisitor
                            ? this.accompanyingVisitorsJson(dto.accompanyingVisitors)
                            : this.accompanyingVisitorsJson(),

                    visit_date: new Date(
                        dto.visit_date,
                    ),

                    total_entries:
                        dto.total_entries,

                    remaining_entries:
                        dto.total_entries,

                    passCode,

                    sms_code: smsCode,

                    qr_code: qrCodeImage,

                    biometric_enabled:
                        dto.biometric_enabled ??
                        false,

                    status:
                        VisitorStatus.PENDING,

                    expiresAt: dayjs(
                        dto.visit_date,
                    )
                        .add(1, 'day')
                        .toDate(),
                },
            })

        await this.createActivityLog({
            estateId: resident.estateId,

            category:
                LogCategory.VISITOR,

            action: 'VISITOR_CREATED',

            description: `Visitor invitation created for ${visitor.name}`,

            actorId: userId,

            actorRole:
                Role.RESIDENT,

            metadata: {
                visitorId: visitor.id,
                visitorName: visitor.name,
                passCode,
            },
        })

        /*
    |--------------------------------------------------------------------------
    | TODO
    |--------------------------------------------------------------------------
    |
    | SEND SMS
    | SEND PUSH NOTIFICATION
    |
    |--------------------------------------------------------------------------
    */

        return success(
            {
                visitor,
                qrCode: qrCodeImage,
                passCode,
                smsCode,
            },
            'Visitor Created',
            'Visitor invitation created successfully',
        )
    }

    // Resident: get visitor
    async getResidentVisitors(
        userId: string,
    ) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const visitors =
            await this.prisma.visitor.findMany({
                where: {
                    residentId: resident.id,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            visitors,
            'Visitors Retrieved',
            'Visitors fetched successfully',
        )
    }

    async getResidentVisitorById(userId: string, visitorId: string) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const visitor = await this.prisma.visitor.findUnique({
            where: {
                id: visitorId,
            },
            include: {
                estate: true,
            },
        })

        if (!visitor) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        // FETCH ACTIVITY LOGS
        const logs =
            await this.prisma.activityLog.findMany({
                where: {
                    estateId: resident.estateId,

                    category: 'VISITOR',

                    metadata: {
                        path: ['visitorId'],
                        equals: visitor.id,
                    },
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            {
                ...visitor,
                logs,
            },
            'Visitor Fetched',
            'Visitor fetched successfully',
            HttpStatus.OK,
        )
    }

    async updateVisitor(
        visitorId: string,
        userId: string,
        dto: UpdateVisitorDto,
    ) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    id: visitorId,
                    residentId: resident.id,
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.REVOKED
        ) {
            return error(
                'Invalid Action',
                'Cannot edit revoked visitor',
                HttpStatus.BAD_REQUEST,
            )
        }

        const updated =
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    ...(dto.name && {
                        name: dto.name,
                    }),

                    ...(dto.phone && {
                        phone: dto.phone,
                    }),

                    ...(dto.purpose && {
                        purpose: dto.purpose,
                    }),

                    ...(dto.plate_no !== undefined && {
                        plate_no: dto.plate_no,
                    }),

                    ...(dto.visit_date && {
                        visit_date: new Date(
                            dto.visit_date,
                        ),

                        expiresAt: dayjs(
                            dto.visit_date,
                        )
                            .add(1, 'day')
                            .toDate(),
                    }),

                    ...(dto.total_entries && {
                        total_entries:
                            dto.total_entries,

                        remaining_entries:
                            dto.total_entries,
                    }),

                    ...(dto.biometric_enabled !==
                        undefined && {
                        biometric_enabled:
                            dto.biometric_enabled,
                    }),

                    ...(dto.hasAccompanyingVisitor !==
                        undefined && {
                        hasAccompanyingVisitor:
                            dto.hasAccompanyingVisitor,
                        accompanyingVisitors:
                            dto.hasAccompanyingVisitor
                                ? this.accompanyingVisitorsJson(dto.accompanyingVisitors)
                                : this.accompanyingVisitorsJson(),
                    }),

                    ...(dto.hasAccompanyingVisitor ===
                        undefined &&
                        dto.accompanyingVisitors !==
                        undefined && {
                        hasAccompanyingVisitor:
                            dto.accompanyingVisitors.length > 0,
                        accompanyingVisitors:
                            this.accompanyingVisitorsJson(dto.accompanyingVisitors),
                    }),
                },
            })

        // logs
        await this.createActivityLog({
            estateId: resident.estateId,

            category: LogCategory.VISITOR,

            action: 'VISITOR_UPDATED',

            description: `Visitor invitation updated for ${updated.name}`,

            actorId: userId,

            actorRole: Role.RESIDENT,

            metadata: {
                visitorId: updated.id,
            },
        })

        return success(
            updated,
            'Visitor Updated',
            'Visitor updated successfully',
        )
    }

    async logQRView(
        visitorId: string,
        userId: string,
    ) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    id: visitorId,
                    residentId: resident.id,
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        await this.createActivityLog({
            estateId: resident.estateId,

            category: LogCategory.VISITOR,

            action: 'QR_VIEWED',

            description: `QR viewed for ${visitor.name}`,

            actorId: userId,

            actorRole: Role.RESIDENT,

            metadata: {
                visitorId: visitor.id,
            },
        })

        return success(
            null,
            'QR Viewed',
            'QR activity logged',
        )
    }

    // guard: validate visitor
    async validateVisitor(
        code: string,
    ) {
        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    OR: [
                        {
                            passCode: code,
                        },
                        {
                            sms_code: code,
                        },
                    ],
                },

                include: {
                    resident: true,
                },
            })

        if (!visitor) {
            return error(
                'Invalid Pass',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        // revoked
        if (
            visitor.status ===
            VisitorStatus.REVOKED
        ) {
            return error(
                'Revoked',
                'Visitor pass has been revoked',
                HttpStatus.BAD_REQUEST,
            )
        }

        // denied
        if (
            visitor.status ===
            VisitorStatus.DENIED
        ) {
            return error(
                'Denied',
                'Visitor access denied',
                HttpStatus.BAD_REQUEST,
            )
        }

        // expired
        if (
            dayjs().isAfter(
                visitor.expiresAt,
            )
        ) {
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.EXPIRED,
                },
            })

            return error(
                'Expired',
                'Visitor pass expired',
                HttpStatus.BAD_REQUEST,
            )
        }

        // No entries
        if (
            visitor.remaining_entries <=
            0
        ) {
            return error(
                'Entry Limit',
                'No remaining entries',
                HttpStatus.BAD_REQUEST,
            )
        }

        return success(
            visitor,
            'Visitor Valid',
            'Visitor validated successfully',
        )
    }

    // guard: qr scan
    async scanQR(
        qrData: string,
        guardId: string,
    ) {
        let decoded

        try {
            const json = Buffer.from(
                qrData,
                'base64',
            ).toString('utf-8')

            decoded = JSON.parse(json)
        } catch {
            return error(
                'Invalid QR',
                'Malformed QR code',
                HttpStatus.BAD_REQUEST,
            )
        }

        const { passCode } = decoded

        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    passCode,
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        await this.prisma.gateQueue.upsert({
            where: {
                visitorId_status: {
                    visitorId: visitor.id,
                    status: 'WAITING',
                },
            },

            update: {
                scannedAt: new Date(),
            },

            create: {
                estateId: visitor.estateId,
                visitorId: visitor.id,
                status: 'WAITING',
            },
        })

        await this.createActivityLog({
            estateId: visitor.estateId,

            category:
                LogCategory.VISITOR,

            action: 'VISITOR_QR_SCANNED',

            description: `QR scanned for ${visitor.name}`,

            actorId: guardId,

            actorRole:
                Role.GUARD,

            metadata: {
                visitorId: visitor.id,
            },
        })

        return success(
            visitor,
            'Visitor Valid',
            'Visitor validated successfully',
        )
    }

    // guard: deny visitor
    async denyVisitor(
        visitorId: string,
        userId: string,
    ) {
        const guard =
            await this.prisma.guard.findUnique({
                where: {
                    userId,
                },
            })

        if (!guard) {
            return error(
                'Guard Not Found',
                'No guard profile linked to this account',
                HttpStatus.BAD_REQUEST,
            )
        }

        const visitor =
            await this.prisma.visitor.findUnique({
                where: {
                    id: visitorId,
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.DENIED
        ) {
            return error(
                'Already Denied',
                'Visitor has already been denied access',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.CHECKED_IN
        ) {
            return error(
                'Visitor Checked In',
                'Cannot deny a visitor already inside the estate',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.REVOKED
        ) {
            return error(
                'Visitor Revoked',
                'Visitor invitation has already been revoked',
                HttpStatus.BAD_REQUEST,
            )
        }

        const result =
            await this.prisma.$transaction(
                async (tx) => {
                    const updated =
                        await tx.visitor.update({
                            where: {
                                id: visitor.id,
                            },

                            data: {
                                status:
                                    VisitorStatus.DENIED,
                            },
                        })

                    await tx.gateLog.create({
                        data: {
                            visitorId:
                                visitor.id,

                            guardId:
                                guard.id,

                            action:
                                'DENY',
                        },
                    })

                    await tx.activityLog.create({
                        data: {
                            estateId:
                                visitor.estateId,

                            category:
                                LogCategory.VISITOR,

                            action:
                                'VISITOR_DENIED',

                            description: `${visitor.name} was denied access at the gate`,

                            actorId:
                                guard.id,

                            actorRole:
                                Role.GUARD,

                            metadata: {
                                visitorId:
                                    visitor.id,

                                visitorName:
                                    visitor.name,
                            },
                        },
                    })

                    // REMOVE FROM QUEUE
                    await tx.gateQueue.updateMany({
                        where: {
                            visitorId:
                                visitor.id,

                            status:
                                'WAITING',
                        },

                        data: {
                            status:
                                'DENIED',

                            processedAt:
                                new Date(),
                        },
                    })

                    return updated
                },
            )

        return success(
            result,
            'Access Denied',
            'Visitor access denied successfully',
        )
    }

    //  guard: check-in
    async checkIn(
        code: string,
        userId: string,
    ) {
        const guard =
            await this.prisma.guard.findUnique({
                where: {
                    userId,
                },
            })

        if (!guard) {
            return error(
                'Guard Not Found',
                'No guard profile linked to this account',
                HttpStatus.BAD_REQUEST,
            )
        }

        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    OR: [
                        {
                            passCode: code,
                        },
                        {
                            sms_code: code,
                        },
                    ],
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.REVOKED
        ) {
            return error(
                'Revoked',
                'Visitor pass revoked',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            dayjs().isAfter(
                visitor.expiresAt,
            )
        ) {
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.EXPIRED,
                },
            })

            return error(
                'Expired',
                'Visitor pass expired',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            visitor.remaining_entries <= 0
        ) {
            return error(
                'Limit Reached',
                'No remaining entries',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.CHECKED_IN
        ) {
            return error(
                'Already Checked In',
                'Visitor is already inside estate',
                HttpStatus.BAD_REQUEST,
            )
        }

        let tracking

        const result =
            await this.prisma.$transaction(
                async (tx) => {
                    const updated =
                        await tx.visitor.update({
                            where: {
                                id: visitor.id,
                            },

                            data: {
                                status:
                                    VisitorStatus.CHECKED_IN,

                                checkedInAt:
                                    new Date(),

                                remaining_entries:
                                {
                                    decrement: 1,
                                },
                            },
                        })

                    await tx.activityLog.create({
                        data: {
                            estateId:
                                visitor.estateId,

                            category:
                                LogCategory.VISITOR,

                            action:
                                'VISITOR_CHECKED_IN',

                            description: `${visitor.name} checked in at the gate`,

                            actorId: guard.id,

                            actorRole:
                                Role.GUARD,

                            metadata: {
                                visitorId:
                                    visitor.id,

                                visitorName:
                                    visitor.name,

                                visitorPlateNo:
                                    visitor.plate_no,
                            },
                        },
                    })

                    await tx.gateLog.create({
                        data: {
                            visitorId:
                                visitor.id,

                            guardId:
                                guard.id,

                            action:
                                'CHECK_IN',
                        },
                    })

                    // REMOVE FROM QUEUE
                    await tx.gateQueue.updateMany({
                        where: {
                            visitorId:
                                visitor.id,

                            status:
                                'WAITING',
                        },

                        data: {
                            status:
                                'APPROVED',

                            processedAt:
                                new Date(),
                        },
                    })

                    // START TRACKING SESSION
                    tracking =
                        await this.trackingService.startTracking(
                            visitor.id,
                        )

                    return updated
                },
            )

        return success(
            { ...result, tracking },
            'Checked In',
            'Visitor checked in successfully',
        )
    }

    //   guard: check-out
    // async checkOut(
    //     code: string,
    //     userId: string,
    // ) {
    //     const guard =
    //         await this.prisma.guard.findUnique({
    //             where: {
    //                 userId,
    //             },
    //         })

    //     if (!guard) {
    //         return error(
    //             'Guard Not Found',
    //             'No guard profile linked to this account',
    //             HttpStatus.BAD_REQUEST,
    //         )
    //     }

    //     const visitor =
    //         await this.prisma.visitor.findFirst({
    //             where: {
    //                 OR: [
    //                     {
    //                         passCode: code,
    //                     },
    //                     {
    //                         sms_code: code,
    //                     },
    //                 ],
    //             },
    //         })

    //     if (!visitor) {
    //         return error(
    //             'Not Found',
    //             'Visitor not found',
    //             HttpStatus.NOT_FOUND,
    //         )
    //     }

    //     if (
    //         visitor.status !==
    //         VisitorStatus.CHECKED_IN
    //     ) {
    //         return error(
    //             'Invalid Status',
    //             'Visitor is not currently checked in',
    //             HttpStatus.BAD_REQUEST,
    //         )
    //     }

    //     const result =
    //         await this.prisma.$transaction(
    //             async (tx) => {
    //                 const updated =
    //                     await tx.visitor.update({
    //                         where: {
    //                             id: visitor.id,
    //                         },

    //                         data: {
    //                             status:
    //                                 VisitorStatus.CHECKED_OUT,

    //                             checkedOutAt:
    //                                 new Date(),
    //                         },
    //                     })

    //                 await tx.trackingSession.updateMany({
    //                     where: {
    //                         visitorId: visitor.id,
    //                         isActive: true,
    //                     },

    //                     data: {
    //                         isActive: false,
    //                         endedAt: new Date(),
    //                     },
    //                 })

    //                 await tx.activityLog.create({
    //                     data: {
    //                         estateId:
    //                             visitor.estateId,

    //                         category:
    //                             LogCategory.VISITOR,

    //                         action:
    //                             'VISITOR_CHECKED_OUT',

    //                         description: `${visitor.name} checked out from the estate`,

    //                         actorId:
    //                             guard.id,

    //                         actorRole:
    //                             Role.GUARD,

    //                         metadata: {
    //                             visitorId:
    //                                 visitor.id,
    //                         },
    //                     },
    //                 })

    //                 await tx.gateLog.create({
    //                     data: {
    //                         visitorId:
    //                             visitor.id,

    //                         guardId:
    //                             guard.id,

    //                         action:
    //                             'CHECK_OUT',
    //                     },
    //                 })

    //                 const activeSession =
    //                     await this.prisma.trackingSession.findFirst({
    //                         where: {
    //                             visitorId:
    //                                 visitor.id,

    //                             isActive: true,
    //                         },
    //                     })

    //                 if (activeSession) {
    //                     await this.trackingService.stopTracking(
    //                         activeSession.id,
    //                     )
    //                 }

    //                 return updated
    //             },
    //         )

    //     return success(
    //         result,
    //         'Checked Out',
    //         'Visitor checked out successfully',
    //     )
    // }

    async checkOut(code: string, userId: string) {
        const guard = await this.prisma.guard.findUnique({
            where: {
                userId,
            },
        })

        if (!guard) {
            return error(
                'Guard Not Found',
                'No guard profile linked to this account',
                HttpStatus.BAD_REQUEST,
            )
        }

        const visitor = await this.prisma.visitor.findFirst({
            where: {
                OR: [
                    { passCode: code },
                    { sms_code: code },
                ],
            },
        })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            visitor.status !== VisitorStatus.CHECKED_IN
        ) {
            return error(
                'Invalid Status',
                'Visitor is not currently checked in',
                HttpStatus.BAD_REQUEST,
            )
        }

        // fetch active session BEFORE transaction
        const activeSession =
            await this.prisma.trackingSession.findFirst({
                where: {
                    visitorId: visitor.id,
                    isActive: true,
                },
            })

        const result =
            await this.prisma.$transaction(async (tx) => {
                const updated = await tx.visitor.update({
                    where: {
                        id: visitor.id,
                    },

                    data: {
                        status:
                            VisitorStatus.CHECKED_OUT,

                        checkedOutAt: new Date(),
                    },
                })

                await tx.trackingSession.updateMany({
                    where: {
                        visitorId: visitor.id,
                        isActive: true,
                    },

                    data: {
                        isActive: false,
                        endedAt: new Date(),
                    },
                })

                await tx.activityLog.create({
                    data: {
                        estateId: visitor.estateId,

                        category: LogCategory.VISITOR,

                        action: 'VISITOR_CHECKED_OUT',

                        description: `${visitor.name} checked out from the estate`,

                        actorId: guard.id,

                        actorRole: Role.GUARD,

                        metadata: {
                            visitorId: visitor.id,
                            visitorName: visitor.name,
                            visitorPlateNo: visitor.plate_no,
                        },
                    },
                })

                await tx.gateLog.create({
                    data: {
                        visitorId: visitor.id,
                        guardId: guard.id,
                        action: 'CHECK_OUT',
                    },
                })

                return updated
            })

        // OUTSIDE transaction
        if (activeSession) {
            await this.trackingService.stopTracking(
                activeSession.id,
            )
        }

        return success(
            result,
            'Checked Out',
            'Visitor checked out successfully',
        )
    }

    //   resident/admin: revoke visitor
    async revokeVisitor(
        visitorId: string,
        userId: string,
    ) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const visitor =
            await this.prisma.visitor.findFirst({
                where: {
                    id: visitorId,
                    residentId: resident.id,
                },
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.REVOKED
        ) {
            return error(
                'Already Revoked',
                'Visitor invitation already revoked',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            visitor.status ===
            VisitorStatus.CHECKED_IN
        ) {
            return error(
                'Visitor Checked In',
                'Cannot revoke a visitor currently inside the estate',
                HttpStatus.BAD_REQUEST,
            )
        }

        const result =
            await this.prisma.$transaction(
                async (tx) => {
                    const updated =
                        await tx.visitor.update({
                            where: {
                                id: visitor.id,
                            },

                            data: {
                                status:
                                    VisitorStatus.REVOKED,
                            },
                        })

                    await tx.activityLog.create({
                        data: {
                            estateId:
                                visitor.estateId,

                            category:
                                LogCategory.VISITOR,

                            action:
                                'VISITOR_REVOKED',

                            description: `Visitor invitation revoked for ${visitor.name}`,

                            actorId:
                                userId,

                            actorRole:
                                Role.RESIDENT,

                            metadata: {
                                visitorId:
                                    visitor.id,
                                visitorName: visitor.name,
                                visitorPlateNo: visitor.plate_no
                            },
                        },
                    })

                    return updated
                },
            )

        return success(
            result,
            'Visitor Revoked',
            'Visitor invitation revoked successfully',
        )
    }

    private generatePassCode(): string {
        return Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    }

    private generateSMSCode(): string {
        const part1 = Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase()

        const part2 = Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase()

        return `${part1}-${part2}`
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
