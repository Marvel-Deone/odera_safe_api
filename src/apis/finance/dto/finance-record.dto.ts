import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum FinanceRecordType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export class CreateFinanceRecordDto {
    @ApiProperty({ example: FinanceRecordType.EXPENSE })
    @IsEnum(FinanceRecordType)
    type!: FinanceRecordType;

     @ApiProperty({ example: 5000 })
    @IsNumber()
    @Min(0.01)
    @Type(() => Number)
    amount!: number;

    @ApiProperty({ example: 'Salary' })
    @IsString()
    description!: string;

     @ApiProperty({ example: 'SECURITY' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({ example: '2024-06-01T12:00:00Z' })
    @IsOptional()
    @IsDateString()
    recordedAt?: string;
}