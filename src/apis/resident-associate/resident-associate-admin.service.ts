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
    ) {}

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
            return error(
                'Not Found',
                'Resident associate not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (
            associate.category !==
            ResidentAssociateCategory.CO_RESIDENT
        ) {
            return error(
                'Invalid Associate',
                'Only co-residents require approval',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (
            associate.approvalStatus !==
            ResidentAssociateApprovalStatus.PENDING
        ) {
            return error(
                'Already Processed',
                `This associate has already been ${associate.approvalStatus.toLowerCase()}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!associate.email) {
            return error(
                'Email Required',
                'Co-resident must have an email before approval',
                HttpStatus.BAD_REQUEST,
            );
        }

    
        const tempPassword = this.generateTemporaryPassword();

        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const gateCredentials = await this.credentialsService.generateGateCredentials();

        //  Create User + activate associate atomically.
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

                    const user = await tx.user.create({
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

    //   Email Delivery
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

        return success(
            {
                associate: approvedAssociate,
                emailDelivery,
            },
            'Associate Approved',
            'Co-resident approved successfully and onboarding email sent',
        );
    }

    async reject(
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
            return error(
                'Not Found',
                'Resident associate not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (
            associate.category !==
            ResidentAssociateCategory.CO_RESIDENT
        ) {
            return error(
                'Invalid Associate',
                'Only co-residents require approval',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (
            associate.approvalStatus !==
            ResidentAssociateApprovalStatus.PENDING
        ) {
            return error(
                'Already Processed',
                `This associate has already been ${associate.approvalStatus.toLowerCase()}`,
                HttpStatus.BAD_REQUEST,
            );
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

        return success(
            rejectedAssociate,
            'Associate Rejected',
            'Co-resident application rejected successfully',
        );
    }
}