import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
} from 'class-validator'

export class CreateVisitorDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string

  @ApiPropertyOptional({
    example: '08012345678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Phone must contain only numbers',
  })
  phone?: string

  @ApiPropertyOptional({
    example: 'Dinner visit',
  })
  @IsOptional()
  @IsString()
  purpose?: string

  @ApiPropertyOptional({
    example: 'ABC-123XY',
  })
  @IsOptional()
  @IsString()
  plate_no?: string

  @ApiProperty({
    example: '2026-05-10T14:00:00.000Z',
  })
  @IsDateString()
  visitDate!: string

  @ApiProperty({
    example: 2,
    description: 'Total number of entries allowed',
  })
  @IsInt()
  @Min(1)
  @Max(20)
  total_entries!: number

  @ApiPropertyOptional({
    example: true,
    description: 'Enable biometric capture at gate (₦500)',
  })
  @IsOptional()
  @IsBoolean()
  biometric_enabled?: boolean
}