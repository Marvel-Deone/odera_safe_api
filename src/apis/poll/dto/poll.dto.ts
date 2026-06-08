import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { PollAudience } from '@prisma/client'

export class CreatePollDto {
  @ApiProperty({
    example:
      'Should CCTV cameras be installed at the estate gate?',
  })
  @IsString()
  question!: string

  @ApiProperty({
    example: [
      'Yes',
      'No',
    ],
  })
  @IsArray()
  @ArrayMinSize(2)
  options!: string[]

  @ApiProperty({
    enum: PollAudience,
    example:
      PollAudience.LEVY_CLEARED_ONLY,
  })
  @IsEnum(PollAudience)
  audience!: PollAudience

  @ApiProperty({
    example:
      '2026-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string
}

export class VotePollDto {
  @ApiProperty({
    example:
      'd4e0d89f-98a8-4eaf-babf-8d0b5c6b3f11',
  })
  @IsString()
  optionId!: string
}