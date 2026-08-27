import {
    HttpStatus,
    Injectable,
} from '@nestjs/common';

import {
    Prisma,
    ResidentAssociateApprovalStatus,
    ResidentAssociateCategory,
    Role,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../database/prisma/prisma.service';
import { EmailService } from '../../shared/email.service';
import { error, success } from '../../common/utils/response.util';
import { ResidentAssociateCredentialsService } from './resident-associate-credentials.service';

@Injectable()
export class ResidentAssociateAdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
        private readonly credentialsService: ResidentAssociateCredentialsService,
    ) { }

    private generateTemporaryPassword() {
        return Math.random().toString(36).slice(-10);
    }

    async findPending() {
        const associates =
            await this.prisma.residentAssociate.findMany({
                where: {
                    category:
                        ResidentAssociateCategory.CO_RESIDENT,

                    approvalStatus:
                        ResidentAssociateApprovalStatus.PENDING,
                },

                include: {
                    resident: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            phone: true,
                            house_no: true,
                            block: true,
                        },
                    },
                },

                orderBy: {
                    createdAt: 'asc',
                },
            });

        return success(
            associates,
            'Pending Associates',
            'Pending co-resident applications fetched successfully',
        );
    }

    async approve(
        associateIds: string[],
        adminUserId: string,
    ) {
        const results: any[] = [];

        for (const associateId of associateIds) {
            const result = await this.approveSingle(
                associateId,
                adminUserId,
            );

            results.push(result);
        }

        return success(
            results,
            'Associates Approved',
            'Co-resident applications processed successfully',
        );
    }

    private async approveSingle(
        associateId: string,
        adminUserId: string,
    ) {
        const associate =
            await this.prisma.residentAssociate.findUnique({
                where: {
                    id: associateId,
                },

                include: {
                    resident: {
                        select: {
                            estateId: true,
                        },
                    },
                },
            });

        if (!associate) {
            return {
                associateId,
                success: false,
                message: 'Resident associate not found',
            };
        }

        if (
            associate.category !==
            ResidentAssociateCategory.CO_RESIDENT
        ) {
            return {
                associateId,
                success: false,
                message: 'Only co-residents require approval',
            };
        }

        if (
            associate.approvalStatus !==
            ResidentAssociateApprovalStatus.PENDING
        ) {
            return {
                associateId,
                success: false,
                message: `This associate has already been ${associate.approvalStatus.toLowerCase()}`,
            };
        }

        if (!associate.email) {
            return {
                associateId,
                success: false,
                message:
                    'Co-resident must have an email before approval',
            };
        }

        const tempPassword =
            this.generateTemporaryPassword();

        const hashedPassword =
            await bcrypt.hash(tempPassword, 10);

        const gateCredentials =
            await this.credentialsService.generateGateCredentials();

        try {
            const approvedAssociate =
                await this.prisma.$transaction(
                    async (tx) => {
                        const existingUser =
                            await tx.user.findUnique({
                                where: {
                                    email: associate.email!,
                                },
                            });

                        if (existingUser) {
                            throw new Error(
                                'A user with this email already exists',
                            );
                        }

                        const user =
                            await tx.user.create({
                                data: {
                                    email: associate.email!,
                                    password: hashedPassword,
                                    role: Role.RESIDENT,
                                    first_login: true,
                                    estateId:
                                        associate.resident.estateId,
                                },
                            });

                        return tx.residentAssociate.update({
                            where: {
                                id: associate.id,
                            },

                            data: {
                                user: {
                                    connect: {
                                        id: user.id,
                                    },
                                },

                                ...gateCredentials,

                                approvalStatus:
                                    ResidentAssociateApprovalStatus.APPROVED,

                                approvedAt: new Date(),

                                approvedById: adminUserId,
                            },

                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        role: true,
                                        first_login: true,
                                    },
                                },
                            },
                        });
                    },
                );

            const appLoginLink =
                process.env.APP_LOGIN_LINK ??
                process.env.APP_DOWNLOAD_LINK ??
                'https://oderasafe.ddsafe.tech';

            const emailDelivery =
                await this.emailService.sendCoResidentWelcomeEmail({
                    toEmail: associate.email,
                    fullName: associate.fullName,
                    temporaryPassword: tempPassword,
                    appLoginLink,
                });

            return {
                associateId,
                success: true,
                associate: approvedAssociate,
                emailDelivery,
            };
        } catch (err) {
            return {
                associateId,
                success: false,
                message:
                    err instanceof Error
                        ? err.message
                        : 'Failed to approve associate',
            };
        }
    }

    async reject(
        associateIds: string[],
        adminUserId: string,
        rejectionReason?: string,
    ) {
        const results: any[] = [];

        for (const associateId of associateIds) {
            const result = await this.rejectSingle(
                associateId,
                adminUserId,
                rejectionReason,
            );

            results.push(result);
        }

        return success(
            results,
            'Associates Rejected',
            'Co-resident applications processed successfully',
        );
    }

    private async rejectSingle(
        associateId: string,
        adminUserId: string,
        rejectionReason?: string,
    ) {
        const associate =
            await this.prisma.residentAssociate.findUnique({
                where: {
                    id: associateId,
                },
            });

        if (!associate) {
            return {
                associateId,
                success: false,
                message: 'Resident associate not found',
            };
        }

        if (
            associate.category !==
            ResidentAssociateCategory.CO_RESIDENT
        ) {
            return {
                associateId,
                success: false,
                message:
                    'Only co-residents require approval',
            };
        }

        if (
            associate.approvalStatus !==
            ResidentAssociateApprovalStatus.PENDING
        ) {
            return {
                associateId,
                success: false,
                message: `This associate has already been ${associate.approvalStatus.toLowerCase()}`,
            };
        }

        const rejectedAssociate =
            await this.prisma.residentAssociate.update({
                where: {
                    id: associate.id,
                },

                data: {
                    approvalStatus:
                        ResidentAssociateApprovalStatus.REJECTED,

                    approvedById: adminUserId,

                    approvedAt: new Date(),

                    rejectionReason:
                        rejectionReason?.trim() || null,
                },
            });

        return {
            associateId,
            success: true,
            associate: rejectedAssociate,
        };
    }
}