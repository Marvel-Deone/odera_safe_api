import {
    IsEnum,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GuardSOSCategory } from '@prisma/client';

export class CreateGuardSosDto {
    @ApiProperty({
        enum: GuardSOSCategory,
        example: GuardSOSCategory.ARMED_THREAT,
    })
    @IsEnum(GuardSOSCategory)
    category!: GuardSOSCategory;

    @ApiPropertyOptional({
        example: 'Gate B',
        description: 'Estate zone or guard post',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    zone?: string;

    @ApiPropertyOptional({
        example: 'Suspicious armed person seen near Gate B',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1_000)
    message?: string;

    @ApiPropertyOptional({ example: 6.5244 })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiPropertyOptional({ example: 3.3792 })
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiPropertyOptional({
        example: 'https://stream.example.com/live/session-token',
    })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    liveStreamUrl?: string;

    @ApiPropertyOptional({
        example: 'mobile-event-018291',
        description: 'Client-generated key for duplicate request prevention',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    idempotencyKey?: string;
}