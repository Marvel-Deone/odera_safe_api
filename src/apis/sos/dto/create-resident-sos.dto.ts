import {
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResidentSosDto {
    @ApiPropertyOptional({
        example: 'I need urgent assistance at home',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1_000)
    message?: string;

    @ApiPropertyOptional({
        example: '12',
        description:
            'Can be omitted when the house number comes from the resident profile',
    })
    @IsOptional()
    @IsString()
    @MaxLength(30)
    houseNumber?: string;

    @ApiPropertyOptional({
        example: 'Palm Avenue',
        description:
            'Can be omitted when the street comes from the resident profile',
    })
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
        example: 'mobile-event-018292',
        description: 'Client-generated key for duplicate request prevention',
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    idempotencyKey?: string;
}