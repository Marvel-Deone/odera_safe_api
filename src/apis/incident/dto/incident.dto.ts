import {
    IsArray,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator'

import { IncidentCategory, IncidentSeverity, TicketPriority } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

// export class CreateIncidentDto {
//     @ApiProperty({
//         example: 'Incident Title',
//     })
//     @IsString()
//     title!: string

//     @ApiProperty({
//         example: 'SECURITY_BREACH',
//     })
//     @IsString()
//     category!: IncidentCategory

//     @ApiProperty({
//         example: 'Incident Description',
//     })
//     @IsString()
//     description!: string

//     @ApiProperty({
//         example: 'MEDIUM',
//     })
//     @IsString()
//     severity!: IncidentSeverity

//     @ApiProperty({
//         example: 'https://example.com/photo1.jpg',
//     })
//     photos?: string[]

//     @ApiProperty({
//         example: '2026-01-01T12:00:00Z',
//     })
//     occurredAt?: string

//     @ApiProperty({
//         example: 'Block-A flat 12',
//     })
//     location?: string
// }
export class CreateIncidentDto {
    @ApiProperty({
        example: 'Water leakage in kitchen',
    })
    @IsString()
    title!: string

    @ApiProperty({
        enum: IncidentCategory,
        example: IncidentCategory.MAINTENANCE,
    })
    @IsEnum(IncidentCategory)
    category!: IncidentCategory

    @ApiProperty({
        example:
            'Water has been leaking from the kitchen sink since yesterday',
    })
    @IsString()
    description!: string

    @ApiProperty({
        enum: IncidentSeverity,
        example: IncidentSeverity.MEDIUM,
    })
    @IsEnum(IncidentSeverity)
    severity!: IncidentSeverity

    @ApiProperty({
        required: false,
        type: [String],
        example: [
            'https://example.com/photo1.jpg',
            'https://example.com/photo2.jpg',
        ],
    })
    @IsOptional()
    @IsArray()
    beforePhotos?: string[]

    @ApiProperty({
        required: false,
        example: 'Block C - Flat 12',
    })
    @IsOptional()
    @IsString()
    location?: string

    @ApiProperty({
        required: false,
        example: '2026-01-01T12:00:00Z',
    })
    @IsOptional()
    @IsDateString()
    occurredAt?: string
}

export class AssignIncidentDto {
    @ApiProperty({
        example: '9876543289756gf6dd55',
    })
    assignedToId!: string
}

export class CompleteIncidentDto {
    @ApiProperty({
        type: [String],
        example: 'https://example.com/photo1.jpg',
    })
    @IsOptional()
    @IsArray()
    afterPhotos?: string[]

    @ApiProperty({
        example: 'Rake, wire',
    })
    @IsOptional()
    @IsString()
    materialsUsed?: string

    @ApiProperty({
        example: '45',
    })
    @IsOptional()
    @IsString()
    timeTaken?: number

    @ApiProperty({
        example: 'Replaced damaged pipe and restored water supply',
    })
    @IsOptional()
    @IsString()
    completionNote?: string
}

export class RateIncidentDto {
    @ApiProperty({
        example: 5,
    })
    rating!: number
}