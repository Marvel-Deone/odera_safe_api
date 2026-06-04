import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'

import { TicketPriority } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateMaintenanceTicketDto {
  @ApiProperty({
    example: 'Water Leakage',
  })
  @IsString()
  title!: string

  @ApiProperty({
    example: 'Water leakage',
  })
  @IsString()
  description!: string

  @ApiProperty({
    example: 'P3_ROUTINE',
  })
  @IsEnum(TicketPriority)
  priority!: TicketPriority

  @ApiProperty({
    example: 'Block - C Flat 12',
  })
  @IsString()
  location!: string

  @ApiProperty({
    example: 'https://example.com/photo1.jpg',
  })
  @IsOptional()
  @IsString()
  beforePhoto?: string
}

export class AssignMaintenanceDto {
  @ApiProperty({
    example: '9876543289756gf6dd55',
  })
  assignedToId!: string
}

export class CompleteMaintenanceDto {
  @ApiProperty({
    example: 'https://example.com/photo1.jpg',
  })
  afterPhoto?: string

  @ApiProperty({
    example: 'Completion note',
  })
  completionNote?: string
}

export class RateTicketDto {
  @ApiProperty({
    example: 5,
  })
  rating!: number
}