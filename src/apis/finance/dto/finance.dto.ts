import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateLevyDto {
  @ApiProperty({ example: 'Monthly Service Levy' })
  @IsString()
  title!: string

  @ApiProperty({ example: 'June estate service charge', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(1)
  amount!: number

  @ApiProperty({ example: '2026-07-31T23:59:59.000Z' })
  @IsDateString()
  dueDate!: string

  @ApiProperty({
    example: ['resident-id-1', 'resident-id-2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  residentIds?: string[]
}

export class FundWalletDto {
  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(100)
  amount!: number
}

export class RequestWithdrawalDto {
  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(1000)
  amount!: number

  @ApiProperty({ example: 'GTBank' })
  @IsString()
  bankName!: string

  @ApiProperty({ example: '0123456789' })
  @IsString()
  accountNumber!: string

  @ApiProperty({ example: 'Ada Resident' })
  @IsString()
  accountName!: string

  @ApiProperty({ example: '058', required: false })
  @IsOptional()
  @IsString()
  bankCode?: string
}

export class RejectWithdrawalDto {
  @ApiProperty({ example: 'Bank details could not be verified' })
  @IsString()
  rejectionReason!: string
}

export class PaystackInitializeDto {
  @ApiProperty({ example: 'resident@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Min(100)
  amount!: number
}
