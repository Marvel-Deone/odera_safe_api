import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ResidentAssociateCategory, Weekday } from '@prisma/client';
import { CreateResidentAssociateDto } from './resident-associate.dto';

const validPayload = {
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '08012345678',
    idType: 'NIN',
    idNumber: '63184876213',
    faceCapture: 'https://example.com/face.jpg',
    workingDays: [Weekday.MONDAY, Weekday.TUESDAY],
    entryTime: '06:00',
    exitTime: '19:00',
};

describe('CreateResidentAssociateDto', () => {
    it('accepts default co-resident payload without category', async () => {
        const { workingDays, entryTime, exitTime, ...coResidentPayload } =
            validPayload;
        const dto = plainToInstance(
            CreateResidentAssociateDto,
            coResidentPayload,
        );

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });

    it('accepts staff category', async () => {
        const dto = plainToInstance(CreateResidentAssociateDto, {
            ...validPayload,
            category: ResidentAssociateCategory.STAFF,
            role: 'Nanny',
        });

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });

    it('does not require a working schedule for co-residents', async () => {
        const { workingDays, entryTime, exitTime, ...coResidentPayload } =
            validPayload;
        const dto = plainToInstance(
            CreateResidentAssociateDto,
            coResidentPayload,
        );

        const errors = await validate(dto);

        expect(errors).toHaveLength(0);
    });

    it('requires email for co-residents', async () => {
        const { email, ...coResidentPayload } = validPayload;
        const dto = plainToInstance(
            CreateResidentAssociateDto,
            coResidentPayload,
        );

        const errors = await validate(dto);

        expect(errors.some((error) => error.property === 'email')).toBe(true);
    });

    it('requires at least one working day for staff', async () => {
        const dto = plainToInstance(CreateResidentAssociateDto, {
            ...validPayload,
            category: ResidentAssociateCategory.STAFF,
            workingDays: [],
        });

        const errors = await validate(dto);

        expect(errors.some((error) => error.property === 'workingDays')).toBe(
            true,
        );
    });

    it('requires HH:mm time format for staff', async () => {
        const dto = plainToInstance(CreateResidentAssociateDto, {
            ...validPayload,
            category: ResidentAssociateCategory.STAFF,
            entryTime: '6 AM',
        });

        const errors = await validate(dto);

        expect(errors.some((error) => error.property === 'entryTime')).toBe(
            true,
        );
    });
});
