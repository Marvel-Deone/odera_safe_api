import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  BusinessCategory,
  BusinessHubStatus,
  BusinessPaymentFrequency,
  Weekday,
} from '@prisma/client'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator'

export class UpsertBusinessHubSettingsDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  registrationFee!: number

  @ApiProperty({ enum: BusinessPaymentFrequency, example: BusinessPaymentFrequency.ANNUAL })
  @IsEnum(BusinessPaymentFrequency)
  paymentFrequency!: BusinessPaymentFrequency

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  maxVehiclesAllowed!: number

  @ApiProperty({ enum: BusinessHubStatus, example: BusinessHubStatus.ENABLED })
  @IsEnum(BusinessHubStatus)
  status!: BusinessHubStatus
}

export class RegisterBusinessDto {
  @ApiProperty({ example: 'Bolatito School' })
  @IsString()
  name!: string

  @ApiProperty({ enum: BusinessCategory, example: BusinessCategory.SCHOOL })
  @IsEnum(BusinessCategory)
  category!: BusinessCategory

  @ApiPropertyOptional({ example: 'Pharmacy' })
  @ValidateIf((dto) => dto.category === BusinessCategory.OTHER)
  @IsString()
  otherCategory?: string

  @ApiProperty({
    enum: Weekday,
    isArray: true,
    example: [Weekday.MONDAY, Weekday.TUESDAY],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Weekday, { each: true })
  validDays!: Weekday[]

  @ApiProperty({ example: '06:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must use HH:mm 24-hour format',
  })
  startTime!: string

  @ApiProperty({ example: '19:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must use HH:mm 24-hour format',
  })
  endTime!: string

  @ApiProperty({ example: true })
  @IsBoolean()
  payNow!: boolean
}

export class PayBusinessRegistrationDto {
  @ApiProperty({ example: 'business-registration-id' })
  @IsString()
  registrationId!: string
}

export class VerifyBusinessPassDto {
  @ApiPropertyOptional({ example: 'BUSINESS:uuid-token' })
  @IsOptional()
  @IsString()
  qrPayload?: string

  @ApiPropertyOptional({ example: '837492' })
  @IsOptional()
  @IsString()
  passcode?: string

  @ApiProperty({ example: 'Main Gate' })
  @IsString()
  gateName!: string

  @ApiPropertyOptional({ example: 'ABC-123XY' })
  @IsOptional()
  @IsString()
  vehiclePlate?: string
}

export class SuspendBusinessRegistrationDto {
  @ApiPropertyOptional({ example: 'Business pass misuse' })
  @IsOptional()
  @IsString()
  reason?: string
}
