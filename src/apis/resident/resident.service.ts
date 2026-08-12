import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
    CompleteResidentProfileDto,
    CreateResidentDto,
    NinVerificationDto,
    ReviewResidentKycDto,
} from './dto/resident.dto';
import * as bcrypt from 'bcrypt';
import { success, error } from '../../common/utils/response.util';
import {
    KycStatus,
    ResidentReviewAction,
    ResidentStatus,
    Role,
} from '@prisma/client';
import { PaystackService } from '../finance/paystack.service';
import { ClientService } from '../../shared/client/client.service';
import dayjs from 'dayjs';
import { FinanceService } from '../finance/finance.service';
import { EmailService } from '../../shared/email.service';

const getErrorMessage = (err: unknown, fallback = 'Unknown error') =>
    err instanceof Error
        ? err.message
        : (err as { message?: string })?.message || fallback;

const getErrorData = (err: unknown) =>
    (err as { response?: { data?: any }; data?: any })?.response?.data ||
    (err as { response?: { data?: any }; data?: any })?.data;

const getResponseMessage = (err: unknown) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;

const getResponseStatus = (
    err: unknown,
    fallback = HttpStatus.INTERNAL_SERVER_ERROR,
) =>
    (
        err as {
            response?: {
                status?: number;
                data?: { statusCode?: number; status?: number };
            };
        }
    )?.response?.status ||
    (
        err as {
            response?: {
                status?: number;
                data?: { statusCode?: number; status?: number };
            };
        }
    )?.response?.data?.statusCode ||
    (
        err as {
            response?: {
                status?: number;
                data?: { statusCode?: number; status?: number };
            };
        }
    )?.response?.data?.status ||
    fallback;

@Injectable()
export class ResidentService {
    qore_id_secret = process.env.QORE_ID_SECRET_KEY;
    qore_id_client_id = process.env.QORE_ID_CLIENT_ID;
    qore_id_url = process.env.QORE_ID_BASE_URL;

    constructor(
        private prisma: PrismaService,
        private paystack: PaystackService,
        private readonly clientsService: ClientService,
        private readonly financeService: FinanceService,
        private readonly emailService: EmailService,
    ) { }

    async onboardResident(dto: CreateResidentDto) {
        const estate = await this.prisma.estate.findFirst();

        if (!estate) {
            return error('Not Found', 'Estate not found', HttpStatus.NOT_FOUND);
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
            );
        }

        const existingResident = await this.prisma.resident.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (existingResident) {
            return error(
                'Duplicate Error',
                'Resident already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (existingUser) {
            return error(
                'Duplicate Error',
                'User already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const tempPassword = Math.random().toString(36).slice(-8);

        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        if (dto.streetId) {
            const street = await this.prisma.estateStreet.findFirst({
                where: {
                    id: dto.streetId,
                    estateId: estate.id,
                },
            });

            if (!street) {
                return error(
                    'Invalid Street',
                    'Street does not belong to this estate',
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    role: Role.RESIDENT,
                    first_login: true,
                    estateId: estate.id,
                },
            });

            const resident = await tx.resident.create({
                data: {
                    ...dto,

                    userId: user.id,

                    estateId: estate.id,

                    status: ResidentStatus.PENDING,

                    kycStatus: KycStatus.NOT_SUBMITTED,

                    ndprConsentGivenAt: new Date(),
                },
            });

            const appDownloadLink = process.env.APP_DOWNLOAD_LINK ?? 'https://localhost:3001'
            const emailDelivery = await this.emailService.sendOnboardingActivationEmail({
                toEmail: dto.email,
                fullName: `${dto.first_name} ${dto.last_name}`,
                houseNumber: dto.house_no,
                activationCode: tempPassword,
                appDownloadLink,
            })

            return {
                resident,
                user,
            };
        });

        return success(
            {
                resident: result.resident,
                tempPassword,
            },
            'Resident Created',
            'Resident account created successfully',
            HttpStatus.CREATED,
        );
    }

    // QoreID Login
    private async qoreIdLogin() {
        try {
            const qoreIdInfo = {
                clientId: this.qore_id_client_id,
                secret: this.qore_id_secret,
            };

            const loginHeaders = { 'Content-Type': 'application/json' };
            console.log('Sending QoreID login request...');
            const qoreid_login = await this.clientsService.postUrl(
                `${this.qore_id_url}/token`,
                qoreIdInfo,
                loginHeaders,
            );
            console.log('QoreID login successful');

            return qoreid_login;
        } catch (err) {
            const statusCode = getResponseStatus(err);
            console.error(
                'Error during QoreID login:',
                getResponseMessage(err) || getErrorMessage(err),
            );
            throw new HttpException(
                {
                    statusCode,
                    status: 'error',
                    title: 'Login Failed',
                    message:
                        getResponseMessage(err) ||
                        'An error occurred during QoreID login.',
                    data: getErrorData(err) || getErrorMessage(err),
                },
                statusCode,
            );
        }
    }

    // NIN Verification
    private async verifyNinWithQoreId(user, accessToken) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            };
            console.log('Sending NIN verification request...');

            const enquiry = await this.clientsService.postUrl(
                `${this.qore_id_url}/v1/ng/identities/face-verification/nin`,
                {
                    idNumber: user.idNumber,
                    photoUrl: user.photoUrl,
                },
                headers,
            );
            console.log('NIN verification response:', enquiry);

            return enquiry;
        } catch (err) {
            const statusCode = getResponseStatus(err, HttpStatus.BAD_GATEWAY);
            console.error(
                'Error during NIN verification:',
                getResponseMessage(err) || getErrorMessage(err),
            );
            throw new HttpException(
                {
                    statusCode,
                    status: 'error',
                    title: 'NIN Verification Failed',
                    message:
                        getResponseMessage(err) ||
                        'An error occurred during NIN verification.',
                    data: getErrorData(err),
                },
                statusCode,
            );
        }
    }

    // Verify NIN
    async verifyNIN(userData) {
        try {
            console.log('Starting NIN verification process...');
            const user = {
                idNumber: userData.idcard_no,
                photoUrl: userData.face_capture,
            };
            console.log('NIN entry created:', user);

            const qoreid_login = await this.qoreIdLogin();
            if (!qoreid_login) {
                throw new HttpException(
                    {
                        status: 'error',
                        title: 'Verification Failed',
                        message: 'Failed to authenticate with QoreID',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            const enquiry = await this.verifyNinWithQoreId(
                user,
                qoreid_login.accessToken,
            );
            if (!enquiry) {
                throw new HttpException(
                    {
                        status: 'error',
                        title: 'Verification Failed',
                        message: 'Failed to verify NIN with QoreID',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }

            return enquiry;
        } catch (err) {
            console.error('Error during NIN verification process:', err);
            if (err instanceof HttpException) {
                throw err;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    status: 'error',
                    title: 'Registration Failed',
                    message:
                        getErrorData(err) ||
                        getErrorMessage(err) ||
                        'An error occurred while verifying NIN.',
                    data: getErrorData(err) || getErrorMessage(err),
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async verifyNinOnly(user: { id: string }, ninData: NinVerificationDto) {
        try {
            // Fetch the latest user details from the database
            const latestUser = await this.prisma.user.findUnique({
                where: { id: user.id },
            });
            const resident = await this.prisma.resident.findFirst({
                where: { userId: user.id },
            });

            const ninExists = await this.prisma.resident.findFirst({
                where: {
                    nin: ninData.idcard_no,
                    userId: { not: user.id },
                },
            });
            if ((process.env.NODE_ENV || '').toLowerCase() !== 'development') {
                if (ninExists) {
                    console.log('Nin exists in database');
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.BAD_REQUEST,
                            status: 'error',
                            title: 'Nin already exists',
                            message: 'This NIN is being used by another user.',
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }
            if (!latestUser || !resident) {
                throw new HttpException(
                    {
                        status: 'error',
                        title: 'Verification Failed',
                        message: 'User not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            // Verify NIN with QoreID
            const verify_nin = await this.verifyNIN(ninData);
            if (!verify_nin || !verify_nin.nin) {
                throw new HttpException(
                    {
                        status: 'error',
                        title: 'Verification Failed',
                        message: 'Failed to verify NIN',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Check face verification match
            if (verify_nin.face_verification) {
                if (!verify_nin.face_verification.match) {
                    console.log(
                        '[NIN Verification] Failed: Face verification mismatch',
                        {
                            match_score:
                                verify_nin.face_verification.match_score,
                            threshold:
                                verify_nin.face_verification.matching_threshold,
                        },
                    );
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.BAD_REQUEST,
                            status: 'error',
                            title: 'Face Verification Failed',
                            message:
                                'Face verification failed. Please ensure the photo matches your NIN.',
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }

                // Check if match score is below threshold
                if (
                    verify_nin.face_verification.match_score <
                    verify_nin.face_verification.matching_threshold
                ) {
                    console.log(
                        '[NIN Verification] Failed: Low face match score',
                        {
                            match_score:
                                verify_nin.face_verification.match_score,
                            threshold:
                                verify_nin.face_verification.matching_threshold,
                        },
                    );
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.BAD_REQUEST,
                            status: 'error',
                            title: 'Face Verification Failed',
                            message:
                                'Face verification score is too low. Please try again with a clearer photo.',
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            // Compare NIN details with latest user details
            if (
                verify_nin.nin.firstname &&
                resident.first_name &&
                verify_nin.nin.firstname.toLowerCase().trim() !==
                resident.first_name.toLowerCase().trim()
            ) {
                console.log('[NIN Verification] Failed: First name mismatch', {
                    nin: verify_nin.nin.firstname,
                    user: resident.first_name,
                });
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        status: 'error',
                        title: 'NIN Mismatch',
                        message:
                            'First name on NIN does not match your account.',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (
                verify_nin.nin.lastname &&
                resident.last_name &&
                verify_nin.nin.lastname.toLowerCase().trim() !==
                resident.last_name.toLowerCase().trim()
            ) {
                console.log('[NIN Verification] Failed: Last name mismatch', {
                    nin: verify_nin.nin.lastname,
                    user: resident.last_name,
                });
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        status: 'error',
                        title: 'NIN Mismatch',
                        message:
                            'Last name on NIN does not match your account.',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (verify_nin.nin.birthdate && resident.dob) {
                // Format dates for comparison (YYYY-MM-DD)
                const ninDob = dayjs(
                    verify_nin.nin.birthdate,
                    'DD-MM-YYYY',
                ).format('YYYY-MM-DD');
                const userDob = dayjs(resident.dob).format('YYYY-MM-DD');

                if (ninDob !== userDob) {
                    console.log('[NIN Verification] Failed: DOB mismatch', {
                        nin: ninDob,
                        user: userDob,
                    });
                    throw new HttpException(
                        {
                            statusCode: HttpStatus.BAD_REQUEST,
                            status: 'error',
                            title: 'NIN Mismatch',
                            message:
                                'Date of birth on NIN does not match your account.',
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            // Ensure idcard_no is properly saved with validation
            if (!ninData.idcard_no) {
                throw new HttpException(
                    {
                        status: 'error',
                        title: 'Validation Failed',
                        message: 'NIN (idcard_no) is required for verification',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const updateData = {
                nin: ninData.idcard_no,
                face_capture: ninData.face_capture,
                kycStatus: KycStatus.COMPLETED,
            };

            console.log(
                '[NIN Verification] Updating user with data:',
                updateData,
            );

            const updatedResident = await this.prisma.resident.update({
                where: { id: resident.id },
                data: updateData,
            });

            console.log(
                '[NIN Verification] Update successful for user:',
                latestUser.id,
            );

            console.log(
                '[NIN Verification] Successfully completed for user:',
                latestUser.id,
            );

            return success(
                {
                    resident: updatedResident,
                    nin_verification: verify_nin,
                },
                'NIN Verification Successful',
                'Your NIN has been verified successfully',
            );
        } catch (err) {
            console.error('[NIN Verification] Error:', err);
            // If it's already an HttpException, throw it directly
            if (err instanceof HttpException) {
                throw err;
            }
            // For other errors, return a generic error
            return error(
                'Verification Failed',
                getErrorMessage(
                    err,
                    'An error occurred during NIN verification',
                ),
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async completeProfile(userId: string, dto: CompleteResidentProfileDto) {
        const resident = await this.prisma.resident.findUnique({
            where: {
                userId,
            },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (resident.status === ResidentStatus.REJECTED) {
            return error(
                'Rejected',
                'Resident account has been rejected',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (resident.kycStatus !== KycStatus.NOT_SUBMITTED) {
            return error(
                'Already Submitted',
                'KYC has already been submitted',
                HttpStatus.BAD_REQUEST,
            );
        }

        // if (dto.streetId) {
        //     const street = await this.prisma.estateStreet.findFirst({
        //         where: {
        //             id: dto.streetId,
        //             estateId: resident.estateId,
        //         },
        //     });

        //     if (!street) {
        //         return error(
        //             'Invalid Street',
        //             'Street does not belong to this estate',
        //             HttpStatus.BAD_REQUEST,
        //         );
        //     }
        // }

        const updatedResident = await this.prisma.resident.update({
            where: {
                userId,
            },
            data: {
                ...dto,
                status: ResidentStatus.UNDER_REVIEW,
                kycStatus: KycStatus.PENDING,
            },
        });

        return success(
            updatedResident,
            'Profile Submitted',
            'Resident profile submitted for review',
            HttpStatus.OK,
        );
    }

    async reviewResident(residentId: string, dto: ReviewResidentKycDto) {
        const resident = await this.prisma.resident.findUnique({
            where: {
                id: residentId,
            },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (
            resident.status === ResidentStatus.ACTIVE ||
            resident.status === ResidentStatus.REJECTED
        ) {
            return error(
                'Invalid Action',
                `Resident already ${resident.status.toLowerCase()}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (dto.action === ResidentReviewAction.REJECT) {
            const updatedResident = await this.prisma.resident.update({
                where: {
                    id: residentId,
                },
                data: {
                    status: ResidentStatus.REJECTED,
                    kycStatus: KycStatus.REJECTED,
                    rejectedAt: new Date(),
                    rejectionReason: dto.rejectionReason,
                },
            });

            return success(
                updatedResident,
                'Rejected',
                'Resident KYC rejected',
            );
        }

        if (resident.kycStatus !== KycStatus.PENDING) {
            return error(
                'Invalid State',
                'Resident has not completed KYC profile',
                HttpStatus.BAD_REQUEST,
            );
        }

        const paystackCustomer = await this.paystack.createCustomer(
            resident.email,
            resident.first_name,
            resident.last_name,
            resident.phone,
        );

        const dedicatedAccount =
            await this.paystack.createDedicatedVirtualAccount(
                paystackCustomer.data.customer_code,
            );

        const result = await this.prisma.$transaction(async (tx) => {
            const updatedResident = await tx.resident.update({
                where: {
                    id: resident.id,
                },
                data: {
                    status: ResidentStatus.ACTIVE,

                    kycStatus: KycStatus.COMPLETED,

                    approvedAt: new Date(),

                    rejectionReason: null,
                },
            });

            const wallet = await tx.wallet.create({
                data: {
                    residentId: resident.id,

                    paystackCustomerCode: paystackCustomer.data.customer_code,

                    virtualAccountNumber: dedicatedAccount.data.account_number,

                    virtualAccountName: dedicatedAccount.data.account_name,

                    virtualBankName: dedicatedAccount.data.bank.name,
                },
            });

            return {
                updatedResident,
                wallet,
            };
        });

        return success(
            {
                resident: result.updatedResident,
                wallet: result.wallet,
                // Monthly resident levy is currently on hold.
                monthlyLevy: null,
            },
            'Approved',
            'Resident approved successfully',
        );
    }

    async getAllResidents(status?: ResidentStatus) {
        const residents = await this.prisma.resident.findMany({
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
        });

        return success(
            residents,
            'Residents Fetched',
            'Residents fetched successfully',
            HttpStatus.OK,
        );
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
                street: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        return success(
            resident,
            'Resident Fetched',
            'Resident fetched successfully',
            HttpStatus.OK,
        );
    }

    async getDashboard(userId: string) {
        const resident = await this.prisma.resident.findFirst({
            where: {
                userId,
            },
        });

        if (!resident) {
            return error(
                'Resident not found',
                'Resident profile does not exist',
                HttpStatus.NOT_FOUND,
            );
        }

        const activeVisitors = await this.prisma.visitor.count({
            where: {
                residentId: resident.id,
                status: {
                    in: ['PENDING', 'CHECKED_IN'],
                },
            },
        });

        const pendingApprovals = await this.prisma.visitor.count({
            where: {
                residentId: resident.id,
                status: 'PENDING',
            },
        });

        const totalPasses = await this.prisma.visitor.count({
            where: {
                residentId: resident.id,
            },
        });

        const recentVisitors = await this.prisma.visitor.findMany({
            where: {
                residentId: resident.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });

        const recentLogs = await this.prisma.activityLog.findMany({
            where: {
                actorId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
        });

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
        );
    }
}
