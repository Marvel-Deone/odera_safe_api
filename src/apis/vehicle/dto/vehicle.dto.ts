import { ApiProperty } from '@nestjs/swagger'
import { AccessDirection } from '@prisma/client'
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123XY' })
  @IsString()
  plateNumber!: string

  @ApiProperty({ example: 'SUV' })
  @IsString()
  vehicleType!: string

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  make!: string

  @ApiProperty({ example: 'RAV4', required: false })
  @IsOptional()
  @IsString()
  model?: string

  @ApiProperty({ example: 'Black' })
  @IsString()
  color!: string

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1900)
  year!: number

  @ApiProperty({ example: 'https://cdn.example.com/registration.pdf' })
  @IsString()
  registrationDocUrl!: string

  @ApiProperty({ example: 'https://cdn.example.com/vehicle.jpg' })
  @IsString()
  vehiclePhotoUrl!: string
}

export class UpdateVehicleDto {
  @ApiProperty({ example: 'ABC-123XY', required: false })
  @IsOptional()
  @IsString()
  plateNumber?: string

  @ApiProperty({ example: 'SUV', required: false })
  @IsOptional()
  @IsString()
  vehicleType?: string

  @ApiProperty({ example: 'Toyota', required: false })
  @IsOptional()
  @IsString()
  make?: string

  @ApiProperty({ example: 'RAV4', required: false })
  @IsOptional()
  @IsString()
  model?: string

  @ApiProperty({ example: 'Black', required: false })
  @IsOptional()
  @IsString()
  color?: string

  @ApiProperty({ example: 2022, required: false })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number

  @ApiProperty({ example: 'https://cdn.example.com/registration.pdf', required: false })
  @IsOptional()
  @IsString()
  registrationDocUrl?: string

  @ApiProperty({ example: 'https://cdn.example.com/vehicle.jpg', required: false })
  @IsOptional()
  @IsString()
  vehiclePhotoUrl?: string
}

export class RejectVehicleDto {
  @ApiProperty({ example: 'Vehicle documents are not clear' })
  @IsString()
  rejectionReason!: string
}

export class VehicleAccessDto {
  @ApiProperty({ example: 'ABC-123XY' })
  @IsString()
  plateNumber!: string

  @ApiProperty({ example: 'Main Gate' })
  @IsString()
  gateName!: string

  @ApiProperty({ enum: AccessDirection, example: AccessDirection.ENTRY })
  @IsEnum(AccessDirection)
  direction!: AccessDirection
}
