import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdateEstateDetailsDto {
    @ApiProperty({ example: 'Odera Estate', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Lekki Phase 1, Lagos', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: 120, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    totalHouses?: number;

    @ApiProperty({ example: { timezone: 'Africa/Lagos' }, required: false })
    @IsOptional()
    settings?: Record<string, any>;
}

export class CreateEstateStreetDto {
    @ApiProperty({ example: 'Freedom Street' })
    @IsString()
    name!: string;
}

export class UpdateEstateStreetDto {
    @ApiProperty({ example: 'Freedom Avenue' })
    @IsString()
    name!: string;
}

export class UpdateEstateSettingsDto {
    @ApiProperty({ example: 2, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    freeVehicleLimit?: number;

    @ApiProperty({ example: 5000, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    vehicleRegistrationFee?: number;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    applyKycLevyGracePeriod?: boolean;
}

export class CreateHeavyVehicleCategoryDto {
    @ApiProperty({ example: 'Construction Truck' })
    @IsString()
    name!: string;

    @ApiProperty({
        example: 'Tipper trucks and construction material carriers',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 25000 })
    @IsNumber()
    @Min(0)
    amount!: number;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}

export class UpdateHeavyVehicleCategoryDto {
    @ApiProperty({ example: 'Construction Truck', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: 'Tipper trucks and construction material carriers',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 25000, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
