import { ApiProperty } from '@nestjs/swagger'
import { AccessType } from '@prisma/client'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateShortletPropertyDto {
  @ApiProperty({ example: 'Airbnb' })
  @IsString()
  platform!: string

  @ApiProperty({ example: 'https://airbnb.com/rooms/123456' })
  @IsString()
  listingUrl!: string

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  bedrooms!: number

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  maxGuests!: number

  @ApiProperty({ example: true })
  @IsBoolean()
  regulationsAccepted!: boolean
}

export class UpdateShortletPropertyDto {
  @ApiProperty({ example: 'Airbnb', required: false })
  @IsOptional()
  @IsString()
  platform?: string

  @ApiProperty({ example: 'https://airbnb.com/rooms/123456', required: false })
  @IsOptional()
  @IsString()
  listingUrl?: string

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  bedrooms?: number

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGuests?: number

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  regulationsAccepted?: boolean
}

export class CreateShortletBookingDto {
  @ApiProperty({ example: 'property-id' })
  @IsString()
  propertyId!: string

  @ApiProperty({ example: 'Amaka Johnson' })
  @IsString()
  guestName!: string

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  guestPhone!: string

  @ApiProperty({ example: 'Nigerian' })
  @IsString()
  nationality!: string

  @ApiProperty({ example: 'Airbnb' })
  @IsString()
  platform!: string

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  guestCount!: number

  @ApiProperty({ example: '2026-07-01T14:00:00.000Z' })
  @IsDateString()
  checkInDate!: string

  @ApiProperty({ example: '2026-07-05T11:00:00.000Z' })
  @IsDateString()
  checkOutDate!: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  biometricRequired?: boolean
}

export class VerifyShortletAccessDto {
  @ApiProperty({ example: 'SHORTLET:booking-id:token', required: false })
  @IsOptional()
  @IsString()
  qrPayload?: string

  @ApiProperty({ example: '582914', required: false })
  @IsOptional()
  @IsString()
  smsCode?: string

  @ApiProperty({ example: 'Main Gate' })
  @IsString()
  gateName!: string

  @ApiProperty({ enum: AccessType, example: AccessType.ENTRY })
  @IsEnum(AccessType)
  type!: AccessType
}

export class UpsertShortletSettingsDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  annualRegistrationFee!: number
}
