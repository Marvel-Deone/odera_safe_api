import { HttpStatus, Injectable } from '@nestjs/common'
// import { ResidentStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma/prisma.service'
import { CreateResidentDto } from './dto/resident.dto'
import * as bcrypt from 'bcrypt'
import { success, error } from '../../common/utils/response.util'
import { ResidentStatus, Role } from '@prisma/client'
// import { ResidentStatus, Role } from '../../../generated/prisma'

@Injectable()
export class ResidentService {
    constructor(private prisma: PrismaService) { }

    async onboardResident(dto: CreateResidentDto) {
        const estate = await this.prisma.estate.findFirst()

        if (!estate) {
            return error('Not Found', 'Estate not found', HttpStatus.NOT_FOUND);
        }

        // NDPR validation
        if (
            !dto.ndprConsentDataProcessing ||
            !dto.ndprConsentIdentity ||
            !dto.ndprConsentThirdParty
        ) {
            return error('NDPR consent', 'NDPR consent must be accepted', HttpStatus.BAD_REQUEST);
        }

        const existingResident = await this.prisma.resident.findFirst({
            where: {
                user: {
                    email: dto.email,
                },
            },
        })

        if (existingResident) {
            return error('Duplicate Error', 'Resident already exists', HttpStatus.BAD_REQUEST);
        }

        let hashedPin: string | undefined = undefined
        if (dto.wallet_pin) {
            hashedPin = await bcrypt.hash(dto.wallet_pin, 10)
        }

        const resident = await this.prisma.resident.create({
            data: {
                ...dto,
                wallet_pin: hashedPin,
                status: ResidentStatus.PENDING,
                ndprConsentGivenAt: new Date(),

                userId: null,
                estateId: estate.id
            },
        })

        return success(
            resident,
            'Resident Created',
            'Resident KYC submitted successfully',
            200,
        )
    }

    async reviewResident(residentId: string, action: 'approve' | 'reject') {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
        })

        if (!resident) {
            return error('Not Found', 'Resident not found', HttpStatus.NOT_FOUND)
        }

        if (
            resident.status === ResidentStatus.REJECTED ||
            resident.status === ResidentStatus.ACTIVE
        ) {
            return error(
                'Invalid Action',
                `Resident already ${resident.status.toLowerCase()}`,
                HttpStatus.BAD_REQUEST,
            )
        }

        // reject flow
        if (action === 'reject') {
            await this.prisma.resident.update({
                where: { id: residentId },
                data: {
                    status: ResidentStatus.REJECTED,
                    rejectedAt: new Date(),
                },
            })

            return success(null, 'Rejected', 'Resident KYC rejected')
        }

        // approval flow
        if (!resident.email) {
            return error(
                'Data Error',
                'Resident email is required for account creation',
                HttpStatus.BAD_REQUEST,
            )
        }

        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: resident.email,
                    password: hashedPassword,
                    role: Role.RESIDENT,
                    first_login: true,
                    estateId: resident.estateId,
                },
            })

            const updatedResident = await tx.resident.update({
                where: { id: residentId },
                data: {
                    userId: user.id,
                    status: ResidentStatus.ACTIVE,
                    approvedAt: new Date(),
                },
            })

            return { user, updatedResident }
        })

        // TODO: integrate Termii SMS here
        // send: "Your OderaSafe login password is ${tempPassword}"

        return success(
            {
                resident: result.updatedResident,
                tempPassword, // remove in production
            },
            'Approved',
            'Resident approved and account created',
        )
    }

    async getAllResidents() {
        const residents = await this.prisma.resident.findMany({
            include: {
                user: true,
                estate: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return success(
            residents,
            'Residents Fetched',
            'Residents fetched successfully',
            HttpStatus.OK,
        )
    }

    async getResidentById(residentId: string) {
        const resident = await this.prisma.resident.findUnique({
            where: {
                id: residentId,
            },
            include: {
                user: true,
                estate: true,
                visitors: true,
            },
        })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            resident,
            'Resident Fetched',
            'Resident fetched successfully',
            HttpStatus.OK,
        )
    }

    async getDashboard(userId: string) {
        const resident =
            await this.prisma.resident.findFirst({
                where: {
                    userId,
                },
            })

        if (!resident) {
            return error(
                'Resident not found',
                'Resident profile does not exist',
                HttpStatus.NOT_FOUND,
            )
        }

        const activeVisitors =
            await this.prisma.visitor.count({
                where: {
                    residentId: resident.id,
                    status: {
                        in: [
                            'PENDING',
                            'CHECKED_IN',
                        ],
                    },
                },
            })

        const pendingApprovals =
            await this.prisma.visitor.count({
                where: {
                    residentId: resident.id,
                    status: 'PENDING',
                },
            })

        const totalPasses =
            await this.prisma.visitor.count({
                where: {
                    residentId: resident.id,
                },
            })

        const recentVisitors =
            await this.prisma.visitor.findMany({
                where: {
                    residentId: resident.id,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
            })

        const recentLogs =
            await this.prisma.activityLog.findMany({
                where: {
                    actorId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10,
            })

        return success(
            {
                activeVisitors,
                pendingApprovals,
                totalPasses,
                recentVisitors,
                recentLogs,
            },
            'Dashboard Loaded',
            'Resident dashboard fetched successfully',
        )
    }
}