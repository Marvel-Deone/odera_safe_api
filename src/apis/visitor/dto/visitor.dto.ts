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
  IsNumber,
  IsArray,
  ArrayMinSize,
  IsEnum,
  ValidateIf,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'
import { IsFutureOrToday } from '../../../common/utils/is-future-or-today.validator'

export enum AccompanyingVisitorAgeCategory {
  CHILD_UNDER_10 = 'CHILD_UNDER_10',
  ADULT_10_PLUS = 'ADULT_10_PLUS',
}

export class AccompanyingVisitorDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({
    enum: AccompanyingVisitorAgeCategory,
    example: AccompanyingVisitorAgeCategory.ADULT_10_PLUS,
  })
  @IsEnum(AccompanyingVisitorAgeCategory)
  ageCategory!: AccompanyingVisitorAgeCategory

  @ApiPropertyOptional({
    example: '08012345678',
    description: 'Required for adults, optional for children under 10',
  })
  @ValidateIf((guest) => guest.ageCategory === AccompanyingVisitorAgeCategory.ADULT_10_PLUS)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only numbers',
  })
  phoneNumber?: string
}

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
  @IsFutureOrToday({
    message: 'Visit date cannot be in the past',
  })
  visit_date!: string

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

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the visitor is coming with accompanying guests',
  })
  @IsOptional()
  @IsBoolean()
  hasAccompanyingVisitor?: boolean

  @ApiPropertyOptional({
    type: [AccompanyingVisitorDto],
    description: 'Required when hasAccompanyingVisitor is true',
  })
  @ValidateIf((dto) => dto.hasAccompanyingVisitor === true)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AccompanyingVisitorDto)
  accompanyingVisitors?: AccompanyingVisitorDto[]
}

export class UpdateVisitorDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  purpose?: string

  @IsOptional()
  @IsString()
  plate_no?: string

  @IsOptional()
  @IsDateString()
  visit_date?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  total_entries?: number

  @IsOptional()
  @IsBoolean()
  biometric_enabled?: boolean

  @IsOptional()
  @IsBoolean()
  hasAccompanyingVisitor?: boolean

  @ValidateIf((dto) => dto.hasAccompanyingVisitor === true || dto.accompanyingVisitors !== undefined)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AccompanyingVisitorDto)
  accompanyingVisitors?: AccompanyingVisitorDto[]
}
