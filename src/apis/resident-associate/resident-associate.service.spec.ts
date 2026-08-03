import { HttpException } from '@nestjs/common';
import { ResidentAssociateCategory, Weekday } from '@prisma/client';
import { of } from 'rxjs';
import { ResidentAssociateService } from './resident-associate.service';

const payload = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '08012345678',
    role: undefined,
    idType: 'VOTER_CARD',
    idNumber: 'VC123456',
    faceCapture: undefined,
};

const staffSchedule = {
    workingDays: [Weekday.MONDAY],
    entryTime: '08:00',
    exitTime: '18:00',
};

describe('ResidentAssociateService', () => {
    const resident = { id: 'resident-id', estateId: 'estate-id' };
    const env = process.env;
    let prisma: any;
    let http: any;
    let emailService: any;
    let service: ResidentAssociateService;

    beforeEach(() => {
        process.env = { ...env };
        prisma = {
            $transaction: jest.fn((callback) =>
                callback({
                    user: {
                        create: jest
                            .fn()
                            .mockResolvedValue({ id: 'co-resident-user-id' }),
                    },
                    residentAssociate: {
                        create:
                            prisma?.residentAssociate?.create ??
                            jest.fn().mockResolvedValue({ id: 'associate-id' }),
                    },
                }),
            ),
            user: {
                findUnique: jest.fn().mockResolvedValue(null),
            },
            resident: {
                findFirst: jest.fn().mockResolvedValue(resident),
                findUnique: jest.fn().mockResolvedValue(null),
            },
            residentAssociate: {
                create: jest.fn().mockResolvedValue({ id: 'associate-id' }),
                findUnique: jest.fn().mockResolvedValue(null),
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        http = {
            post: jest.fn(),
        };

        emailService = {
            sendCoResidentWelcomeEmail: jest
                .fn()
                .mockResolvedValue({ accepted: true, status: 'SENT' }),
        };

        service = new ResidentAssociateService(prisma, http, emailService);
    });

    afterAll(() => {
        process.env = env;
    });

    it('creates a co-resident by default', async () => {
        await service.create('user-id', {
            ...payload,
            workingDays: [Weekday.MONDAY],
            entryTime: '08:00',
            exitTime: '18:00',
        });

        expect(prisma.$transaction).toHaveBeenCalled();
        expect(emailService.sendCoResidentWelcomeEmail).toHaveBeenCalledWith(
            expect.objectContaining({
                toEmail: payload.email,
                fullName: payload.fullName,
                temporaryPassword: expect.any(String),
            }),
        );
        expect(prisma.residentAssociate.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                category: ResidentAssociateCategory.CO_RESIDENT,
                email: payload.email,
                role: 'Co-resident',
                resident: { connect: { id: resident.id } },
                user: { connect: { id: 'co-resident-user-id' } },
                workingDays: [],
                entryTime: null,
                exitTime: null,
            }),
        });
    });

    it('creates a co-resident without a working schedule', async () => {
        await service.create('user-id', payload);

        expect(prisma.residentAssociate.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                category: ResidentAssociateCategory.CO_RESIDENT,
                email: payload.email,
                workingDays: [],
                entryTime: null,
                exitTime: null,
            }),
        });
    });

    it('rejects invalid staff time ranges', async () => {
        await expect(
            service.create('user-id', {
                ...payload,
                category: ResidentAssociateCategory.STAFF,
                workingDays: [Weekday.MONDAY],
                entryTime: '18:00',
                exitTime: '08:00',
            }),
        ).rejects.toBeInstanceOf(HttpException);
    });

    it('requires a working schedule for staff', async () => {
        await expect(
            service.create('user-id', {
                ...payload,
                category: ResidentAssociateCategory.STAFF,
            }),
        ).rejects.toBeInstanceOf(HttpException);
    });

    it('requires email for co-residents', async () => {
        const { email, ...coResidentPayload } = payload;

        await expect(
            service.create('user-id', coResidentPayload),
        ).rejects.toBeInstanceOf(HttpException);
    });

    it('requires face capture before NIN verification', async () => {
        await expect(
            service.create('user-id', {
                ...payload,
                ...staffSchedule,
                category: ResidentAssociateCategory.STAFF,
                idType: 'NIN',
                idNumber: '63184876213',
            }),
        ).rejects.toBeInstanceOf(HttpException);

        expect(prisma.residentAssociate.create).not.toHaveBeenCalled();
    });

    it('verifies NIN before creating the associate', async () => {
        process.env.QORE_ID_BASE_URL = 'https://qoreid.example';
        process.env.QORE_ID_CLIENT_ID = 'client-id';
        process.env.QORE_ID_SECRET_KEY = 'secret';
        service = new ResidentAssociateService(prisma, http, emailService);

        http.post
            .mockReturnValueOnce(of({ data: { accessToken: 'token' } }))
            .mockReturnValueOnce(
                of({ data: { face_verification: { match: true } } }),
            );

        await service.create('user-id', {
            ...payload,
            ...staffSchedule,
            category: ResidentAssociateCategory.STAFF,
            idType: 'NIN',
            idNumber: '63184876213',
            faceCapture: 'https://example.com/face.jpg',
        });

        expect(http.post).toHaveBeenCalledTimes(2);
        expect(prisma.residentAssociate.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                ninVerificationStatus: 'VERIFIED',
                ninVerificationData: { face_verification: { match: true } },
            }),
        });
    });
});
