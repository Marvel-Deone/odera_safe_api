import { HttpStatus, Injectable } from '@nestjs/common'
// import { ResidentStatus } from '@prisma/client'
import { PrismaService } from '../../database/prisma/prisma.service'
import { CompleteResidentProfileDto, CreateResidentDto, ReviewResidentKycDto } from './dto/resident.dto'
import * as bcrypt from 'bcrypt'
import { success, error } from '../../common/utils/response.util'
import { KycStatus, ResidentReviewAction, ResidentStatus, Role } from '@prisma/client'
import { PaystackService } from '../finance/paystack.service'
// import { ResidentStatus, Role } from '../../../generated/prisma'

@Injectable()
export class ResidentService {
    constructor(
        private prisma: PrismaService,
        private paystack: PaystackService,
    ) { }

    async onboardResident(dto: CreateResidentDto) {
        const estate = await this.prisma.estate.findFirst()

        if (!estate) {
            return error(
                'Not Found',
                'Estate not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            !dto.ndprConsentDataProcessing ||
            !dto.ndprConsentIdentity ||
            !dto.ndprConsentThirdParty
        ) {
            return error(
                'NDPR Consent',
                'NDPR consent must be accepted',
                HttpStatus.BAD_REQUEST,
            )
        }

        const existingResident =
            await this.prisma.resident.findUnique({
                where: {
                    email: dto.email,
                },
            })

        if (existingResident) {
            return error(
                'Duplicate Error',
                'Resident already exists',
                HttpStatus.BAD_REQUEST,
            )
        }

        const existingUser =
            await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            })

        if (existingUser) {
            return error(
                'Duplicate Error',
                'User already exists',
                HttpStatus.BAD_REQUEST,
            )
        }

        const tempPassword =
            Math.random().toString(36).slice(-8)

        const hashedPassword =
            await bcrypt.hash(tempPassword, 10)

        if (dto.streetId) {
            const street =
                await this.prisma.estateStreet.findFirst({
                    where: {
                        id: dto.streetId,
                        estateId: estate.id,
                    },
                })

            if (!street) {
                return error(
                    'Invalid Street',
                    'Street does not belong to this estate',
                    HttpStatus.BAD_REQUEST,
                )
            }
        }

        const result =
            await this.prisma.$transaction(
                async (tx) => {
                    const user =
                        await tx.user.create({
                            data: {
                                email: dto.email,
                                password: hashedPassword,
                                role: Role.RESIDENT,
                                first_login: true,
                                estateId: estate.id,
                            },
                        })

                    const resident =
                        await tx.resident.create({
                            data: {
                                ...dto,

                                userId: user.id,

                                estateId: estate.id,

                                status:
                                    ResidentStatus.PENDING,

                                kycStatus:
                                    KycStatus.NOT_SUBMITTED,

                                ndprConsentGivenAt:
                                    new Date(),
                            },
                        })

                    return {
                        resident,
                        user,
                    }
                },
            )

        return success(
            {
                resident: result.resident,
                tempPassword,
            },
            'Resident Created',
            'Resident account created successfully',
            HttpStatus.CREATED,
        )
    }

    async completeProfile(
        userId: string,
        dto: CompleteResidentProfileDto,
    ) {
        const resident =
            await this.prisma.resident.findUnique({
                where: {
                    userId,
                },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (resident.status === ResidentStatus.REJECTED) {
            return error(
                'Rejected',
                'Resident account has been rejected',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            resident.kycStatus !==
            KycStatus.NOT_SUBMITTED
        ) {
            return error(
                'Already Submitted',
                'KYC has already been submitted',
                HttpStatus.BAD_REQUEST,
            )
        }

        if (dto.streetId) {
            const street =
                await this.prisma.estateStreet.findFirst({
                    where: {
                        id: dto.streetId,
                        estateId: resident.estateId,
                    },
                })

            if (!street) {
                return error(
                    'Invalid Street',
                    'Street does not belong to this estate',
                    HttpStatus.BAD_REQUEST,
                )
            }
        }

        const updatedResident =
            await this.prisma.resident.update({
                where: {
                    userId,
                },
                data: {
                    ...dto,
                    status: ResidentStatus.UNDER_REVIEW,
                    kycStatus: KycStatus.PENDING,
                },
            })

        return success(
            updatedResident,
            'Profile Submitted',
            'Resident profile submitted for review',
            HttpStatus.OK,
        )
    }

    async reviewResident(
        residentId: string,
        dto: ReviewResidentKycDto
    ) {
        const resident =
            await this.prisma.resident.findUnique({
                where: {
                    id: residentId,
                },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (
            resident.status === ResidentStatus.ACTIVE ||
            resident.status === ResidentStatus.REJECTED
        ) {
            return error(
                'Invalid Action',
                `Resident already ${resident.status.toLowerCase()}`,
                HttpStatus.BAD_REQUEST,
            )
        }

        if (
            dto.action === ResidentReviewAction.REJECT
        ) {
            const updatedResident =
                await this.prisma.resident.update({
                    where: {
                        id: residentId,
                    },
                    data: {
                        status: ResidentStatus.REJECTED,
                        kycStatus: KycStatus.REJECTED,
                        rejectedAt: new Date(),
                        rejectionReason: dto.rejectionReason,
                    },
                })

            return success(
                updatedResident,
                'Rejected',
                'Resident KYC rejected',
            )
        }

        if (
            resident.kycStatus !== KycStatus.PENDING
        ) {
            return error(
                'Invalid State',
                'Resident has not completed KYC profile',
                HttpStatus.BAD_REQUEST,
            )
        }

        const paystackCustomer =
            await this.paystack.createCustomer(
                resident.email,
                resident.first_name,
                resident.last_name,
                resident.phone,
            )

        const dedicatedAccount =
            await this.paystack.createDedicatedVirtualAccount(
                paystackCustomer.data.customer_code,
            )

        const result =
            await this.prisma.$transaction(
                async (tx) => {
                    const updatedResident =
                        await tx.resident.update({
                            where: {
                                id: resident.id,
                            },
                            data: {
                                status:
                                    ResidentStatus.ACTIVE,

                                kycStatus:
                                    KycStatus.COMPLETED,

                                approvedAt:
                                    new Date(),

                                rejectionReason:
                                    null,
                            },
                        })

                    const wallet =
                        await tx.wallet.create({
                            data: {
                                residentId:
                                    resident.id,

                                paystackCustomerCode:
                                    paystackCustomer.data
                                        .customer_code,

                                virtualAccountNumber:
                                    dedicatedAccount.data
                                        .account_number,

                                virtualAccountName:
                                    dedicatedAccount.data
                                        .account_name,

                                virtualBankName:
                                    dedicatedAccount.data
                                        .bank.name,
                            },
                        })

                    return {
                        updatedResident,
                        wallet,
                    }
                },
            )

        return success(
            {
                resident:
                    result.updatedResident,
                wallet: result.wallet,
            },
            'Approved',
            'Resident approved successfully',
        )
    }

    async getAllResidents(
        status?: ResidentStatus,
    ) {
        const residents =
            await this.prisma.resident.findMany({
                where: status
                    ? {
                        status,
                    }
                    : undefined,

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
