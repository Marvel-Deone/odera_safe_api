import {
    IsBoolean,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmergencyContactType } from '@prisma/client';

export class CreateEmergencyContactDto {
    @ApiProperty({
        example: 'Central Police Station',
    })
    @IsString()
    @MaxLength(150)
    name!: string;

    @ApiProperty({
        enum: EmergencyContactType,
        example: EmergencyContactType.POLICE,
    })
    @IsEnum(EmergencyContactType)
    type!: EmergencyContactType;

    @ApiProperty({
        example: '+2348012345678',
    })
    @IsPhoneNumber()
    phone!: string;

    @ApiPropertyOptional({
        example: '+2348012345678',
    })
    @IsOptional()
    @IsPhoneNumber()
    smsPhone?: string;
}

export class UpdateEmergencyContactDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;

    @ApiPropertyOptional({
        enum: EmergencyContactType,
    })
    @IsOptional()
    @IsEnum(EmergencyContactType)
    type?: EmergencyContactType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    smsPhone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class CallEmergencyContactDto {
    @ApiProperty({
        description: 'Incident connected to the emergency call',
    })
    @IsUUID()
    incidentId!: string;

    @ApiPropertyOptional({
        example: 'Police contacted for immediate assistance',
    })
    @IsOptional()
    @IsString()
    @MaxLength(2_000)
    note?: string;
}

export class SendEmergencyMessageDto {
    @ApiProperty({
        description: 'Incident connected to the emergency message',
    })
    @IsUUID()
    incidentId!: string;

    @ApiProperty({
        example:
            'Emergency at the main gate. Immediate police assistance is required.',
    })
    @IsString()
    @MaxLength(1_000)
    message!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(2_000)
    note?: string;
}