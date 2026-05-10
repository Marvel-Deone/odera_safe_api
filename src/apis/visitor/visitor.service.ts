import {
    HttpStatus,
    Injectable,
} from '@nestjs/common'

import {
    LogCategory,
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

@Injectable()
export class VisitorService {
    constructor(
        private prisma: PrismaService,
    ) { }

    /*
  |--------------------------------------------------------------------------
  | RESIDENT: CREATE VISITOR
  |--------------------------------------------------------------------------
  */

    async createVisitor(
        userId: string,
        dto: CreateVisitorDto,
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

        // generate codes
        const passCode =
            this.generatePassCode()

        const smsCode =
            this.generateSMSCode()

        /*
    |--------------------------------------------------------------------------
    | QR PAYLOAD
    |--------------------------------------------------------------------------
    */

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

        /*
    |--------------------------------------------------------------------------
    | CREATE VISITOR
    |--------------------------------------------------------------------------
    */

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

                    /*
          |--------------------------------------------------------------------------
          | STATUS FLOW
          |--------------------------------------------------------------------------
          |
          | PENDING
          | CHECKED_IN
          | CHECKED_OUT
          | DENIED
          | REVOKED
          | EXPIRED
          |
          |--------------------------------------------------------------------------
          */

                    status:
                        VisitorStatus.PENDING,

                    expiresAt: dayjs(
                        dto.visit_date,
                    )
                        .add(1, 'day')
                        .toDate(),
                },
            })

        /*
    |--------------------------------------------------------------------------
    | CREATE ACTIVITY LOG
    |--------------------------------------------------------------------------
    */

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

    /*
  |--------------------------------------------------------------------------
  | RESIDENT: GET VISITORS
  |--------------------------------------------------------------------------
  */

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
                },
            })

        // LOG
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

    // GUARD: VALIDATE VISITOR

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

        /*
    |--------------------------------------------------------------------------
    | REVOKED
    |--------------------------------------------------------------------------
    */

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

        /*
    |--------------------------------------------------------------------------
    | DENIED
    |--------------------------------------------------------------------------
    */

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

        // Checked-in
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

        /*
    |--------------------------------------------------------------------------
    | EXPIRED
    |--------------------------------------------------------------------------
    */

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

        /*
    |--------------------------------------------------------------------------
    | NO ENTRIES
    |--------------------------------------------------------------------------
    */

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

    /*
  |--------------------------------------------------------------------------
  | GUARD: QR SCAN
  |--------------------------------------------------------------------------
  */

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

        return this.checkIn(
            passCode,
            guardId,
        )
    }

    async denyVisitor(
        visitorId: string,
        guardId: string,
    ) {
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

        const updated =
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.DENIED,
                },
            })

        /*
      |--------------------------------------------------------------------------
      | GATE LOG
      |--------------------------------------------------------------------------
      */

        await this.prisma.gateLog.create({
            data: {
                visitorId: visitor.id,
                guardId,
                action: 'DENY',
            },
        })

        /*
      |--------------------------------------------------------------------------
      | ACTIVITY LOG
      |--------------------------------------------------------------------------
      */

        await this.createActivityLog({
            estateId: visitor.estateId,

            category:
                LogCategory.VISITOR,

            action: 'VISITOR_DENIED',

            description: `${visitor.name} was denied access at the gate`,

            actorId: guardId,

            actorRole:
                Role.GUARD,

            metadata: {
                visitorId: visitor.id,
                visitorName: visitor.name,
            },
        })

        return success(
            updated,
            'Access Denied',
            'Visitor access denied successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | GUARD: CHECK IN
  |--------------------------------------------------------------------------
  */

    async checkIn(
        code: string,
        guardId: string,
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
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        /*
    |--------------------------------------------------------------------------
    | VALIDATIONS
    |--------------------------------------------------------------------------
    */

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
            visitor.remaining_entries <=
            0
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

        /*
    |--------------------------------------------------------------------------
    | CHECK IN
    |--------------------------------------------------------------------------
    */

        const updated =
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.CHECKED_IN,

                    checkedInAt: new Date(),

                    remaining_entries: {
                        decrement: 1,
                    },
                },
            })

        /*
    |--------------------------------------------------------------------------
    | LOG
    |--------------------------------------------------------------------------
    */

        await this.createActivityLog({
            estateId: visitor.estateId,

            category:
                LogCategory.VISITOR,

            action: 'VISITOR_CHECKED_IN',

            description: `${visitor.name} checked in at the gate`,

            actorId: guardId,

            actorRole:
                Role.GUARD,

            metadata: {
                visitorId: visitor.id,
                visitorName: visitor.name,
            },
        })

        await this.prisma.gateLog.create({
            data: {
                visitorId: visitor.id,
                guardId,
                action: 'CHECK_IN',
            },
        })

        return success(
            updated,
            'Checked In',
            'Visitor checked in successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | GUARD: CHECK OUT
  |--------------------------------------------------------------------------
  */

    async checkOut(
        code: string,
        guardId: string,
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
            })

        if (!visitor) {
            return error(
                'Not Found',
                'Visitor not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const updated =
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.CHECKED_OUT,

                    checkedOutAt:
                        new Date(),
                },
            })

        /*
    |--------------------------------------------------------------------------
    | LOG
    |--------------------------------------------------------------------------
    */

        await this.createActivityLog({
            estateId: visitor.estateId,

            category:
                LogCategory.VISITOR,

            action:
                'VISITOR_CHECKED_OUT',

            description: `${visitor.name} checked out from the estate`,

            actorId: guardId,

            actorRole:
                Role.GUARD,

            metadata: {
                visitorId: visitor.id,
            },
        })

        await this.prisma.gateLog.create({
            data: {
                visitorId: visitor.id,
                guardId,
                action: 'CHECK_OUT',
            },
        })

        return success(
            updated,
            'Checked Out',
            'Visitor checked out successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | RESIDENT: REVOKE VISITOR
  |--------------------------------------------------------------------------
  */

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

        const updated =
            await this.prisma.visitor.update({
                where: {
                    id: visitor.id,
                },

                data: {
                    status:
                        VisitorStatus.REVOKED,
                },
            })

        /*
    |--------------------------------------------------------------------------
    | LOG
    |--------------------------------------------------------------------------
    */

        await this.createActivityLog({
            estateId: visitor.estateId,

            category:
                LogCategory.VISITOR,

            action: 'VISITOR_REVOKED',

            description: `Visitor invitation revoked for ${visitor.name}`,

            actorId: userId,

            actorRole:
                Role.RESIDENT,

            metadata: {
                visitorId: visitor.id,
            },
        })

        return success(
            updated,
            'Visitor Revoked',
            'Visitor invitation revoked successfully',
        )
    }

    /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

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

    //   ACTIVITY LOG

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