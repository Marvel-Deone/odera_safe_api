import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResidentAssociateCategory, Weekday } from '@prisma/client';
import {
    ArrayMinSize,
    IsArray,
    IsDefined,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Matches,
    ValidateIf,
} from 'class-validator';

export class CreateResidentAssociateDto {
    @ApiProperty({
        enum: ResidentAssociateCategory,
        example: ResidentAssociateCategory.CO_RESIDENT,
        default: ResidentAssociateCategory.CO_RESIDENT,
    })
    @IsOptional()
    @IsEnum(ResidentAssociateCategory)
    category?: ResidentAssociateCategory;

    @ApiProperty({ example: 'Jane Doe' })
    @IsString()
    fullName!: string;

    @ApiPropertyOptional({
        example: 'jane@example.com',
        description:
            'Required for co-residents so they can receive login credentials.',
    })
    @ValidateIf(
        (dto: CreateResidentAssociateDto) =>
            dto.category !== ResidentAssociateCategory.STAFF,
    )
    @IsDefined()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: '08012345678' })
    @IsString()
    @Matches(/^[0-9]+$/, {
        message: 'Phone number must contain only numbers',
    })
    phoneNumber!: string;

    @ApiPropertyOptional({ example: 'Co-resident', default: 'Co-resident' })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiProperty({ example: 'NIN' })
    @IsString()
    idType?: string;

    @ApiProperty({ example: '63184876213' })
    @IsString()
    idNumber?: string;

    @ApiPropertyOptional({
        example: 'https://example.com/face-capture.jpg',
        description:
            'Required when idType is NIN and QoreID face verification is expected',
    })
    @IsOptional()
    @IsString()
    faceCapture?: string;

    @ApiPropertyOptional({
        enum: Weekday,
        isArray: true,
        example: [Weekday.MONDAY, Weekday.TUESDAY],
        description:
            'Required for staff only. Co-residents do not use a working schedule.',
    })
    @ValidateIf(
        (dto: CreateResidentAssociateDto) =>
            dto.category === ResidentAssociateCategory.STAFF,
    )
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(Weekday, { each: true })
    workingDays?: Weekday[];

    @ApiPropertyOptional({
        example: '06:00',
        description:
            'Required for staff only. Co-residents do not use a working schedule.',
    })
    @ValidateIf(
        (dto: CreateResidentAssociateDto) =>
            dto.category === ResidentAssociateCategory.STAFF,
    )
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: 'entryTime must use HH:mm 24-hour format',
    })
    entryTime?: string;

    @ApiPropertyOptional({
        example: '19:00',
        description:
            'Required for staff only. Co-residents do not use a working schedule.',
    })
    @ValidateIf(
        (dto: CreateResidentAssociateDto) =>
            dto.category === ResidentAssociateCategory.STAFF,
    )
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: 'exitTime must use HH:mm 24-hour format',
    })
    exitTime?: string;
}

export class UpdateResidentAssociateDto {
    @ApiPropertyOptional({ enum: ResidentAssociateCategory })
    @IsOptional()
    @IsEnum(ResidentAssociateCategory)
    category?: ResidentAssociateCategory;

    @ApiPropertyOptional({ example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: 'jane@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '08012345678' })
    @IsOptional()
    @IsString()
    @Matches(/^[0-9]+$/, {
        message: 'Phone number must contain only numbers',
    })
    phoneNumber?: string;

    @ApiPropertyOptional({ example: 'Nanny' })
    @IsOptional()
    @IsString()
    role?: string;

    @ApiPropertyOptional({ example: 'NIN' })
    @IsOptional()
    @IsString()
    idType?: string;

    @ApiPropertyOptional({ example: '63184876213' })
    @IsOptional()
    @IsString()
    idNumber?: string;

    @ApiPropertyOptional({ example: 'https://example.com/face-capture.jpg' })
    @IsOptional()
    @IsString()
    faceCapture?: string;

    @ApiPropertyOptional({ enum: Weekday, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(Weekday, { each: true })
    workingDays?: Weekday[];

    @ApiPropertyOptional({ example: '06:00' })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: 'entryTime must use HH:mm 24-hour format',
    })
    entryTime?: string;

    @ApiPropertyOptional({ example: '19:00' })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
        message: 'exitTime must use HH:mm 24-hour format',
    })
    exitTime?: string;
}
