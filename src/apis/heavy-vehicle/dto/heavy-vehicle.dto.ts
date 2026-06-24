import { ApiProperty } from '@nestjs/swagger'
import { AccessDirection, PaymentOption } from '@prisma/client'
import { IsDateString, IsEnum, IsString } from 'class-validator'

export class CreateHeavyVehiclePassDto {
  @ApiProperty({ example: 'category-id' })
  @IsString()
  heavyVehicleCategoryId!: string

  @ApiProperty({ example: 'Chinedu Okafor' })
  @IsString()
  driverName!: string

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  driverPhone!: string

  @ApiProperty({ example: 'KJA-456ZZ' })
  @IsString()
  plateNumber!: string

  @ApiProperty({ example: 'Blue Mack truck delivering roofing materials' })
  @IsString()
  vehicleDescription!: string

  @ApiProperty({ example: '2026-07-01T08:00:00.000Z' })
  @IsDateString()
  entryDate!: string

  @ApiProperty({ example: '2026-07-01T18:00:00.000Z' })
  @IsDateString()
  exitDate!: string

  @ApiProperty({ enum: PaymentOption, example: PaymentOption.PAY_NOW })
  @IsEnum(PaymentOption)
  paymentOption!: PaymentOption
}

export class RejectHeavyVehiclePassDto {
  @ApiProperty({ example: 'Delivery date is not permitted' })
  @IsString()
  rejectionReason!: string
}

export class HeavyVehicleAccessDto {
  @ApiProperty({ example: 'pass-id' })
  @IsString()
  passId!: string

  @ApiProperty({ example: 'Service Gate' })
  @IsString()
  gateName!: string

  @ApiProperty({ enum: AccessDirection, example: AccessDirection.ENTRY })
  @IsEnum(AccessDirection)
  direction!: AccessDirection
}
