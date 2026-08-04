import {
    IsEnum,
    IsBoolean,
    IsOptional,
    IsString,
    IsNumber,
} from 'class-validator';
import { EmergencyContactType, GuardSOSCategory } from '@prisma/client';

export class CreateGuardSOSDto {
    @IsEnum(GuardSOSCategory)
    category!: GuardSOSCategory;

    @IsOptional()
    @IsString()
    zone?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;
}

export class ResolveGuardSOSDto {
    @IsOptional()
    @IsString()
    resolutionNote?: string;
}

export class EscalateGuardSOSDto {
    @IsOptional()
    @IsString()
    note?: string;
}

export class TriggerGuardSOSAlarmDto {
    @IsOptional()
    @IsString()
    note?: string;
}

export class CloseGuardSOSDto {
    @IsOptional()
    @IsString()
    note?: string;
}

export class CreateEmergencyContactDto {
    @IsString()
    name!: string;

    @IsEnum(EmergencyContactType)
    type!: EmergencyContactType;

    @IsString()
    phone!: string;

    @IsOptional()
    @IsString()
    smsPhone?: string;
}

export class UpdateEmergencyContactDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(EmergencyContactType)
    type?: EmergencyContactType;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    smsPhone?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class EmergencyContactActionDto {
    @IsOptional()
    @IsString()
    incidentId?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsString()
    note?: string;
}
