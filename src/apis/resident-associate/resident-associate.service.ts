import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
    NinVerificationStatus,
    Prisma,
    ResidentAssociateCategory,
    Role,
} from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { error, success } from '../../common/utils/response.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import {
    CreateResidentAssociateDto,
    UpdateResidentAssociateDto,
} from './dto/resident-associate.dto';
import { EmailService } from '../../shared/email.service';

@Injectable()
export class ResidentAssociateService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly http: HttpService,
        private readonly emailService: EmailService,
        private readonly financeService: FinanceService,
    ) { }

    private qoreIdSecret = process.env.QORE_ID_SECRET_KEY;
    private qoreIdClientId = process.env.QORE_ID_CLIENT_ID;
    private qoreIdUrl = process.env.QORE_ID_BASE_URL;

    private assertValidTimeRange(entryTime: string, exitTime: string) {
        if (entryTime >= exitTime) {
            error(
                'Invalid Time Range',
                'Exit time must be after entry time',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private assertStaffSchedule(input: {
        category: ResidentAssociateCategory;
        workingDays?: unknown[];
        entryTime?: string | null;
        exitTime?: string | null;
    }) {
        if (input.category !== ResidentAssociateCategory.STAFF) {
            return;
        }

        if (!input.workingDays?.length || !input.entryTime || !input.exitTime) {
            error(
                'Working Schedule Required',
                'Working days, entry time, and exit time are required for staff',
                HttpStatus.BAD_REQUEST,
            );
        }

        this.assertValidTimeRange(input.entryTime!, input.exitTime!);
    }

    private isNin(idType?: string | null) {
        return idType?.trim().toUpperCase() === 'NIN';
    }

    private async getResident(userId: string) {
        const resident = await this.prisma.resident.findFirst({
            where: { userId },
        });

        if (!resident) {
            error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        return resident!;
    }

    private generateTemporaryPassword() {
        return Math.random().toString(36).slice(-10);
    }

    private async generateGateCredentials(): Promise<{
        passcode: string;
        qrPayload: string;
        qrCode: string;
    }> {
        for (let attempt = 0; attempt < 10; attempt++) {
            const passcode = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();
            const qrPayload = `CO_RESIDENT:${randomUUID()}`;
            const existing = await this.prisma.residentAssociate.findFirst({
                where: { OR: [{ passcode }, { qrPayload }] },
                select: { id: true },
            });

            if (!existing) {
                return {
                    passcode,
                    qrPayload,
                    qrCode: await QRCode.toDataURL(qrPayload),
                };
            }
        }

        error(
            'Credential Error',
            'Unable to generate unique co-resident gate credentials',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );

        return undefined!;
    }

    private async ensureGateCredentials(associateId: string) {
        const associate = await this.prisma.residentAssociate.findUnique({
            where: { id: associateId },
            select: {
                passcode: true,
                qrPayload: true,
                qrCode: true,
            },
        });

        if (!associate) {
            error(
                'Not Found',
                'Co-resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (associate!.passcode && associate!.qrPayload && associate!.qrCode) {
            return associate!;
        }

        return this.prisma.residentAssociate.update({
            where: { id: associateId },
            data: await this.generateGateCredentials(),
            select: {
                passcode: true,
                qrPayload: true,
                qrCode: true,
            },
        });
    }

    private async assertUniqueCoResidentEmail(
        email: string,
        current?: { userId?: string | null; associateId?: string | null },
    ) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== current?.userId) {
            error(
                'Duplicate Error',
                'A user with this email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existingResident = await this.prisma.resident.findUnique({
            where: { email },
        });

        if (existingResident) {
            error(
                'Duplicate Error',
                'A resident with this email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existingAssociate =
            await this.prisma.residentAssociate.findUnique({
                where: { email },
            });

        if (
            existingAssociate &&
            existingAssociate.id !== current?.associateId
        ) {
            error(
                'Duplicate Error',
                'A resident associate with this email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private async qoreIdLogin() {
        if (!this.qoreIdUrl || !this.qoreIdClientId || !this.qoreIdSecret) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    status: 'error',
                    title: 'NIN Verification Not Configured',
                    message: 'QoreID environment variables are not configured',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        try {
            const response = await firstValueFrom(
                this.http.post(
                    `${this.qoreIdUrl}/token`,
                    {
                        clientId: this.qoreIdClientId,
                        secret: this.qoreIdSecret,
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 30_000,
                    },
                ),
            );

            return response.data.accessToken;
        } catch (err) {
            const statusCode = axios.isAxiosError(err)
                ? (err.response?.status ?? HttpStatus.BAD_GATEWAY)
                : HttpStatus.BAD_GATEWAY;

            throw new HttpException(
                {
                    statusCode,
                    status: 'error',
                    title: 'NIN Verification Login Failed',
                    message: axios.isAxiosError(err)
                        ? (err.response?.data?.message ?? err.message)
                        : 'Unable to authenticate with QoreID',
                    data: axios.isAxiosError(err)
                        ? err.response?.data
                        : undefined,
                },
                statusCode,
            );
        }
    }

    private async verifyNin(input: { idNumber: string; photoUrl?: string }) {
        if (!input.photoUrl) {
            return error(
                'Face Capture Required',
                'Face capture is required for NIN verification',
                HttpStatus.BAD_REQUEST,
            );
        }

        const accessToken = await this.qoreIdLogin();

        try {
            const response = await firstValueFrom(
                this.http.post(
                    `${this.qoreIdUrl}/v1/ng/identities/face-verification/nin`,
                    {
                        idNumber: input.idNumber,
                        photoUrl: input.photoUrl,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                        timeout: 30_000,
                    },
                ),
            );

            const data = response.data;

            if (data?.face_verification && !data.face_verification.match) {
                return error(
                    'Face Verification Failed',
                    'Face verification failed. Please ensure the photo matches the NIN.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            return data;
        } catch (err) {
            const statusCode = axios.isAxiosError(err)
                ? (err.response?.status ?? HttpStatus.BAD_GATEWAY)
                : HttpStatus.BAD_GATEWAY;

            throw new HttpException(
                {
                    statusCode,
                    status: 'error',
                    title: 'NIN Verification Failed',
                    message: axios.isAxiosError(err)
                        ? (err.response?.data?.message ?? err.message)
                        : 'Unable to verify NIN',
                    data: axios.isAxiosError(err)
                        ? err.response?.data
                        : undefined,
                },
                statusCode,
            );
        }
    }

    async create(userId: string, dto: CreateResidentAssociateDto) {
        const resident = await this.getResident(userId);
        const category = dto.category ?? ResidentAssociateCategory.CO_RESIDENT;
        this.assertStaffSchedule({
            category,
            workingDays: dto.workingDays,
            entryTime: dto.entryTime,
            exitTime: dto.exitTime,
        });
        const role = dto.role?.trim() || 'Co-resident';
        const email = dto.email?.trim().toLowerCase();

        if (category === ResidentAssociateCategory.CO_RESIDENT && !email) {
            error(
                'Email Required',
                'Email is required for co-residents',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (category === ResidentAssociateCategory.CO_RESIDENT) {
            await this.assertUniqueCoResidentEmail(email!);
        }

        // const ninVerificationData = this.isNin(dto.idType)
        //     ? await this.verifyNin({
        //           idNumber: dto.idNumber!,
        //           photoUrl: dto.faceCapture,
        //       })
        //     : null;

        const associateData: Prisma.ResidentAssociateCreateInput = {
            resident: { connect: { id: resident.id } },
            category,
            fullName: dto.fullName,
            email:
                category === ResidentAssociateCategory.CO_RESIDENT
                    ? email
                    : null,
            phoneNumber: dto.phoneNumber,
            role,
            idType: dto.idType,
            idNumber: dto.idNumber,
            faceCapture: dto.faceCapture,
            workingDays:
                category === ResidentAssociateCategory.STAFF
                    ? dto.workingDays
                    : [],
            entryTime:
                category === ResidentAssociateCategory.STAFF
                    ? dto.entryTime
                    : null,
            exitTime:
                category === ResidentAssociateCategory.STAFF
                    ? dto.exitTime
                    : null,
            // ninVerificationStatus: ninVerificationData
            //     ? NinVerificationStatus.VERIFIED
            //     : NinVerificationStatus.NOT_SUBMITTED,
        };

        // if (ninVerificationData) {
        //     associateData.ninVerificationData =
        //         ninVerificationData as Prisma.InputJsonValue;
        // }

        if (category === ResidentAssociateCategory.CO_RESIDENT) {
            const gateCredentials = await this.generateGateCredentials();
            const tempPassword = this.generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            const associate = await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: email!,
                        password: hashedPassword,
                        role: Role.RESIDENT,
                        first_login: true,
                        estateId: resident.estateId,
                    },
                });

                return tx.residentAssociate.create({
                    data: {
                        ...associateData,
                        ...gateCredentials,
                        user: { connect: { id: user.id } },
                    },
                });
            });

            const appLoginLink =
                process.env.APP_LOGIN_LINK ??
                process.env.APP_DOWNLOAD_LINK ??
                'https://oderasafe.ddsafe.tech';
            const emailDelivery =
                await this.emailService.sendCoResidentWelcomeEmail({
                    toEmail: email!,
                    fullName: dto.fullName,
                    temporaryPassword: tempPassword,
                    appLoginLink,
                });

            return success(
                {
                    associate,
                    emailDelivery,
                    // Monthly resident levy is currently on hold.
                    monthlyLevy: null,
                },
                'Associate Created',
                'Co-resident created successfully and welcome email sent',
                HttpStatus.CREATED,
            );
        }

        const associate = await this.prisma.residentAssociate.create({
            data: associateData,
        });

        return success(
            associate,
            'Associate Created',
            'Resident associate created successfully',
            HttpStatus.CREATED,
        );
    }

    async findMine(userId: string) {
        const resident = await this.getResident(userId);
        const associates = await this.prisma.residentAssociate.findMany({
            where: { residentId: resident.id },
            orderBy: { createdAt: 'desc' },
        });

        return success(
            associates,
            'Associates Retrieved',
            'Resident associates fetched successfully',
        );
    }

    async getCoResidentDashboard(userId: string) {
        const associate = await this.prisma.residentAssociate.findFirst({
            where: {
                userId,
                category: ResidentAssociateCategory.CO_RESIDENT,
            },
            include: {
                resident: {
                    include: {
                        estate: true,
                        street: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        apartmentType: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        first_login: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!associate) {
            return error(
                'Forbidden',
                'Only co-residents can access this dashboard',
                HttpStatus.FORBIDDEN,
            );
        }

        const gateCredentials = await this.ensureGateCredentials(associate.id);

        return success(
            {
                associate: {
                    id: associate.id,
                    fullName: associate.fullName,
                    email: associate.email,
                    phoneNumber: associate.phoneNumber,
                    role: associate.role,
                    category: associate.category,
                    ninVerificationStatus: associate.ninVerificationStatus,
                    createdAt: associate.createdAt,
                    updatedAt: associate.updatedAt,
                },
                gateAccess: gateCredentials,
                mainResident: {
                    id: associate.resident.id,
                    firstName: associate.resident.first_name,
                    lastName: associate.resident.last_name,
                    email: associate.resident.email,
                    phone: associate.resident.phone,
                    houseNo: associate.resident.house_no,
                    block: associate.resident.block,
                    street: associate.resident.street,
                    apartmentType: associate.resident.apartmentType,
                },
                estate: {
                    id: associate.resident.estate.id,
                    name: associate.resident.estate.name,
                    address: associate.resident.estate.address,
                },
                account: associate.user,
            },
            'Co-resident Dashboard',
            'Co-resident dashboard fetched successfully',
        );
    }

    async update(
        userId: string,
        associateId: string,
        dto: UpdateResidentAssociateDto,
    ) {
        const resident = await this.getResident(userId);
        const associate = await this.prisma.residentAssociate.findFirst({
            where: { id: associateId, residentId: resident.id },
        });

        if (!associate) {
            return error(
                'Not Found',
                'Resident associate not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const category = dto.category ?? associate.category;
        const workingDays = dto.workingDays ?? associate.workingDays;
        const entryTime = dto.entryTime ?? associate.entryTime;
        const exitTime = dto.exitTime ?? associate.exitTime;
        this.assertStaffSchedule({
            category,
            workingDays,
            entryTime,
            exitTime,
        });

        const idType = dto.idType ?? associate.idType;
        const idNumber = dto.idNumber ?? associate.idNumber;
        const faceCapture =
            dto.faceCapture ?? associate.faceCapture ?? undefined;
        const shouldVerifyNin =
            this.isNin(idType) &&
            Boolean(idNumber) &&
            (dto.idType !== undefined ||
                dto.idNumber !== undefined ||
                dto.faceCapture !== undefined);

        const ninVerificationData = shouldVerifyNin
            ? await this.verifyNin({
                idNumber: idNumber!,
                photoUrl: faceCapture,
            })
            : undefined;

        const normalizedEmail = dto.email?.trim().toLowerCase();

        if (
            normalizedEmail &&
            category === ResidentAssociateCategory.CO_RESIDENT &&
            normalizedEmail !== associate.email
        ) {
            await this.assertUniqueCoResidentEmail(normalizedEmail, {
                userId: associate.userId,
                associateId: associate.id,
            });
        }

        const updateData: Prisma.ResidentAssociateUpdateInput = {
            ...(dto.category !== undefined ? { category: dto.category } : {}),
            ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
            ...(dto.email !== undefined &&
                category === ResidentAssociateCategory.CO_RESIDENT
                ? { email: normalizedEmail }
                : {}),
            ...(dto.phoneNumber !== undefined
                ? { phoneNumber: dto.phoneNumber }
                : {}),
            ...(dto.role !== undefined ? { role: dto.role } : {}),
            ...(dto.idType !== undefined ? { idType: dto.idType } : {}),
            ...(dto.idNumber !== undefined ? { idNumber: dto.idNumber } : {}),
            ...(dto.faceCapture !== undefined
                ? { faceCapture: dto.faceCapture }
                : {}),
            ...(category === ResidentAssociateCategory.STAFF
                ? {
                    ...(dto.workingDays !== undefined
                        ? { workingDays: dto.workingDays }
                        : {}),
                    ...(dto.entryTime !== undefined
                        ? { entryTime: dto.entryTime }
                        : {}),
                    ...(dto.exitTime !== undefined
                        ? { exitTime: dto.exitTime }
                        : {}),
                }
                : { workingDays: [], entryTime: null, exitTime: null }),
            ...(ninVerificationData !== undefined
                ? {
                    ninVerificationStatus: NinVerificationStatus.VERIFIED,
                    ninVerificationData:
                        ninVerificationData as Prisma.InputJsonValue,
                }
                : {}),
        };

        const updated =
            normalizedEmail &&
                category === ResidentAssociateCategory.CO_RESIDENT &&
                associate.userId
                ? await this.prisma.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id: associate.userId! },
                        data: { email: normalizedEmail },
                    });

                    return tx.residentAssociate.update({
                        where: { id: associate.id },
                        data: updateData,
                    });
                })
                : await this.prisma.residentAssociate.update({
                    where: { id: associate.id },
                    data: updateData,
                });

        // Monthly resident levy is currently on hold.

        return success(
            updated,
            'Associate Updated',
            'Resident associate updated successfully',
        );
    }

    async remove(userId: string, associateId: string) {
        const resident = await this.getResident(userId);
        const associate = await this.prisma.residentAssociate.findFirst({
            where: { id: associateId, residentId: resident.id },
        });

        if (!associate) {
            return error(
                'Not Found',
                'Resident associate not found',
                HttpStatus.NOT_FOUND,
            );
        }

        await this.prisma.residentAssociate.delete({
            where: { id: associate.id },
        });

        // Monthly resident levy is currently on hold.

        return success(
            null,
            'Associate Deleted',
            'Resident associate deleted successfully',
        );
    }
}
