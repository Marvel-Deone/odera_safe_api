import {
    IsBoolean,
    IsEnum,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminSosCategory, IncidentSeverity } from '@prisma/client';

export class CreateAdminSosDto {
    @ApiProperty({
        enum: AdminSosCategory,
        example: AdminSosCategory.POLICE_ASSISTANCE,
    })
    @IsEnum(AdminSosCategory)
    category!: AdminSosCategory;

    @ApiProperty({
        enum: IncidentSeverity,
        example: IncidentSeverity.CRITICAL,
    })
    @IsEnum(IncidentSeverity)
    severity!: IncidentSeverity;

    @ApiProperty({
        example: 'Immediate police assistance required at the main gate',
    })
    @IsString()
    @MaxLength(1_000)
    message!: string;

    @ApiPropertyOptional({ example: 'Main Gate' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    zone?: string;

    @ApiPropertyOptional({ example: '12' })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    houseNumber?: string;

    @ApiPropertyOptional({ example: 'Palm Avenue' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    streetName?: string;

    @ApiPropertyOptional({ example: 6.5244 })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiPropertyOptional({ example: 3.3792 })
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiPropertyOptional({
        default: false,
        description:
            'Whether the incident should immediately be raised to all authorized recipients',
    })
    @IsOptional()
    @IsBoolean()
    escalateImmediately?: boolean;

    @ApiPropertyOptional({
        default: false,
        description:
            'Whether the SOS requires police or emergency-service intervention',
    })
    @IsOptional()
    @IsBoolean()
    requiresEmergencyContact?: boolean;

    @ApiPropertyOptional({
        example: 'mobile-event-018293',
        description: 'Client-generated key for duplicate request prevention',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    idempotencyKey?: string;
}