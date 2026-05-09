import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'
import { VisitorStatus } from '@prisma/client'
import dayjs from 'dayjs'
import * as QRCode from 'qrcode'
import { CreateVisitorDto } from './dto/visitor.dto'

@Injectable()
export class VisitorService {
    constructor(private prisma: PrismaService) { }

    // resident: create visitor
    async createVisitor(userId: string, dto: CreateVisitorDto) {
        const resident = await this.prisma.resident.findFirst({
            where: { userId },
        })

        if (!resident) {
            return error('Not Found', 'Resident profile not found', HttpStatus.NOT_FOUND)
        }

        const passCode = this.generatePassCode()
        const smsCode = this.generateSMSCode()

        // qrpayload
        const payload = {
            passCode,
            t: Date.now(),
        }

        // Encode to Base64
        const qrPayload = Buffer.from(JSON.stringify(payload)).toString('base64')

        // Generate QR
        const qrCodeImage = await QRCode.toDataURL(qrPayload)

        const visitor = await this.prisma.visitor.create({
            data: {
                estateId: resident.estateId,
                residentId: resident.id,

                name: dto.name,
                phone: dto.phone,
                purpose: dto.purpose,
                plate_no: dto.plate_no,

                visitDate: new Date(dto.visitDate),

                total_entries: dto.total_entries,
                remaining_entries: dto.total_entries,

                passCode,
                sms_code: smsCode,

                qr_code: qrCodeImage,

                expiresAt: dayjs(dto.visitDate).add(1, 'day').toDate(),

                biometric_enabled: dto.biometric_enabled ?? false,

                status: VisitorStatus.APPROVED,
            },
        })

        return success(
            {
                visitor,
                passCode,
                smsCode,
                qrCode: qrCodeImage,
            },
            'Visitor Created',
            'Visitor invitation created successfully',
        )
    }

    //   guard: validate pass
    async validateVisitor(passCode: string) {
        const visitor = await this.prisma.visitor.findFirst({
            where: {
                OR: [
                    { passCode },
                    { sms_code: passCode },
                ],
            },
        })

        if (!visitor) {
            return error('Not Found', 'Invalid pass code', HttpStatus.NOT_FOUND)
        }

        if (visitor.status === VisitorStatus.DENIED) {
            return error('Access Denied', 'Visitor access denied', HttpStatus.BAD_REQUEST)
        }

        if (dayjs().isAfter(visitor.expiresAt)) {
            return error('Expired', 'Visitor pass has expired', HttpStatus.BAD_REQUEST)
        }

        if (visitor.remaining_entries <= 0) {
            return error('Entry Limit', 'No entries remaining', HttpStatus.BAD_REQUEST)
        }

        return success(visitor, 'Valid Visitor', 'Visitor is valid')
    }

    async scanQR(qrData: string, guardId: string) {
        // const { passCode, t } = decoded
        // if (!passCode || !t) {
        //     return error('Invalid QR', 'Invalid QR payload', HttpStatus.BAD_REQUEST)
        // }

        // // optional: reject QR older than X hours
        // const MAX_QR_AGE = 1000 * 60 * 60 * 24 // 24hrs

        // if (Date.now() - t > MAX_QR_AGE) {
        //     return error('Expired QR', 'QR code expired', HttpStatus.BAD_REQUEST)
        // }
        let decoded

        try {
            const json = Buffer.from(qrData, 'base64').toString('utf-8')
            decoded = JSON.parse(json)
        } catch (err) {
            return error('Invalid QR', 'Malformed QR code', HttpStatus.BAD_REQUEST)
        }

        const { passCode } = decoded

        const visitor = await this.prisma.visitor.findFirst({
            where: { passCode },
        })

        if (!visitor) {
            return error('Invalid QR', 'Visitor not found', HttpStatus.NOT_FOUND)
        }

        // reuse validation logic
        if (visitor.remaining_entries <= 0) {
            return error('Entry Limit', 'No entries remaining', HttpStatus.BAD_REQUEST)
        }

        if (new Date() > visitor.expiresAt) {
            return error('Expired', 'Visitor pass expired', HttpStatus.BAD_REQUEST)
        }

        const updated = await this.prisma.$transaction(async (tx) => {
            const v = await tx.visitor.update({
                where: { id: visitor.id },
                data: {
                    status: VisitorStatus.CHECKED_IN,
                    checkedInAt: new Date(),
                    remaining_entries: {
                        decrement: 1,
                    },
                },
            })

            await tx.gateLog.create({
                data: {
                    visitorId: visitor.id,
                    guardId,
                    action: 'CHECK_IN',
                },
            })

            return v
        })

        return success(updated, 'Access Granted', 'Visitor checked in via QR')
    }

    //  guard: check-in
    async checkIn(passCode: string, guardId: string) {
        const visitor = await this.prisma.visitor.findFirst({
            where: {
                OR: [
                    { passCode },
                    { sms_code: passCode },
                ],
            },
        })

        if (!visitor) {
            return error('Not Found', 'Visitor not found', HttpStatus.NOT_FOUND)
        }

        if (visitor.remaining_entries <= 0) {
            return error('Entry Limit Reached', 'No entries remaining', HttpStatus.BAD_REQUEST)
        }

        if (dayjs().isAfter(visitor.expiresAt)) {
            return error('Expired', 'Visitor pass has expired', HttpStatus.BAD_REQUEST)
        }

        const updatedVisitor = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.visitor.update({
                where: { id: visitor.id },
                data: {
                    status: VisitorStatus.CHECKED_IN,
                    checkedInAt: new Date(),
                    remaining_entries: {
                        decrement: 1,
                    },
                },
            })

            await tx.gateLog.create({
                data: {
                    visitorId: visitor.id,
                    guardId,
                    action: 'CHECK_IN',
                },
            })

            return updated
        })

        return success(updatedVisitor, 'Checked In', 'Visitor checked in successfully')
    }

    //   guard: check-out
    async checkOut(passCode: string, guardId: string) {
        const visitor = await this.prisma.visitor.findFirst({
            where: {
                OR: [
                    { passCode },
                    { sms_code: passCode },
                ],
            },
        })

        if (!visitor) {
            return error('Not Found', 'Visitor not found', HttpStatus.NOT_FOUND)
        }

        const updatedVisitor = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.visitor.update({
                where: { id: visitor.id },
                data: {
                    status: VisitorStatus.CHECKED_OUT,
                    checkedOutAt: new Date(),
                },
            })

            await tx.gateLog.create({
                data: {
                    visitorId: visitor.id,
                    guardId,
                    action: 'CHECK_OUT',
                },
            })

            return updated
        })

        return success(updatedVisitor, 'Checked Out', 'Visitor checked out successfully')
    }

    // fetch visitors
    async getResidentVisitors(userId: string) {
        const resident = await this.prisma.resident.findFirst({
            where: { userId },
        })

        if (!resident) {
            return error('Not Found', 'Resident profile not found', HttpStatus.NOT_FOUND)
        }

        const visitors = await this.prisma.visitor.findMany({
            where: {
                residentId: resident.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(visitors, 'Visitors Fetched', 'Visitors retrieved successfully')
    }

    // helpers
    private generatePassCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    private generateSMSCode(): string {
        const part1 = Math.random().toString(36).substring(2, 5).toUpperCase()
        const part2 = Math.random().toString(36).substring(2, 5).toUpperCase()
        return `${part1}-${part2}`
    }
}