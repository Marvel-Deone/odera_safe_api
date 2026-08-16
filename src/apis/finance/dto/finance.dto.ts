import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Min,
    ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ResolveAccountDto {
    @ApiProperty({ example: '23450987650' })
    @IsString()
    accountNumber!: string;

    @ApiProperty({ example: '092622' })
    @IsString()
    bankCode!: string;
}

export class LevyApartmentTypePriceDto {
    @ApiProperty({ example: 'apartment-type-id' })
    @IsString()
    apartmentTypeId!: string;

    @ApiProperty({ example: 100000 })
    @IsNumber()
    @Min(1)
    amount!: number;
}

export class CreateLevyDto {
    @ApiProperty({ example: 'Monthly Service Levy' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'June estate service charge', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 50000 })
    @IsNumber()
    @Min(1)
    amount!: number;

    @ApiProperty({ example: '2026-07-31T23:59:59.000Z' })
    @IsDateString()
    dueDate!: string;

    @ApiProperty({
        example: ['resident-id-1', 'resident-id-2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    residentIds?: string[];

    @ApiProperty({
        required: false,
        type: [LevyApartmentTypePriceDto],
        example: [
            { apartmentTypeId: 'duplex-id', amount: 100000 },
            { apartmentTypeId: 'shop-id', amount: 40000 },
        ],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LevyApartmentTypePriceDto)
    apartmentTypePrices?: LevyApartmentTypePriceDto[];
}

export class UpdateLevyDto {
    @ApiProperty({ example: 'Monthly Service Levy', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: 'Updated estate service charge', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 50000, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    amount?: number;

    @ApiProperty({ example: '2026-07-31T23:59:59.000Z', required: false })
    @IsOptional()
    @IsDateString()
    dueDate?: string;
    @ApiProperty({
        example: ['resident-id-1', 'resident-id-2'],
        required: false,
    })

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    residentIds?: string[];

    @ApiProperty({
        required: false,
        type: [LevyApartmentTypePriceDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LevyApartmentTypePriceDto)
    apartmentTypePrices?: LevyApartmentTypePriceDto[];
}

export class FundWalletDto {
    @ApiProperty({ example: 10000 })
    @IsNumber()
    @Min(100)
    amount!: number;
}

export class RequestWithdrawalDto {
    @ApiProperty({ example: 20000 })
    @IsNumber()
    @Min(1000)
    amount!: number;

    @ApiProperty({ example: 'GTBank' })
    @IsString()
    bankName!: string;

    @ApiProperty({ example: '0123456789' })
    @IsString()
    accountNumber!: string;

    @ApiProperty({ example: 'Ada Resident' })
    @IsString()
    accountName!: string;

    @ApiProperty({ example: '058', required: false })
    @IsOptional()
    @IsString()
    bankCode?: string;
}

export class SetEstateWalletPinDto {
    @ApiProperty({ example: '1234' })
    @IsString()
    @Matches(/^\d{4,6}$/, {
        message: 'PIN must be 4 to 6 digits',
    })
    pin!: string;
}

export class EstateWalletWithdrawalDto extends RequestWithdrawalDto {
    @ApiProperty({ example: '1234' })
    @IsString()
    @IsNotEmpty()
    pin!: string;
}

export class RejectWithdrawalDto {
    @ApiProperty({ example: 'Bank details could not be verified' })
    @IsString()
    rejectionReason!: string;
}

export class PaystackInitializeDto {
    @ApiProperty({ example: 'resident@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 10000 })
    @IsNumber()
    @Min(100)
    amount!: number;
}
