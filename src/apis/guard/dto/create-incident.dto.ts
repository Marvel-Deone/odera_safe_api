import { ApiProperty } from '@nestjs/swagger'
import {
    IncidentCategory,
    IncidentSeverity,
} from '@prisma/client'
import { IsString } from 'class-validator'

export class CreateIncidentDto {
    @ApiProperty({
        example: 'Incident Title',
    })
    @IsString()
    title!: string

    @ApiProperty({
        example: 'SECURITY_BREACH',
    })
    @IsString()
    category!: IncidentCategory

    @ApiProperty({
        example: 'Incident Description',
    })
    @IsString()
    description!: string

    @ApiProperty({
        example: 'MEDIUM',
    })
    @IsString()
    severity!: IncidentSeverity

    @ApiProperty({
        example: 'https://example.com/photo1.jpg',
    })
    photos?: string[]

        @ApiProperty({
        example: '2026-01-01T12:00:00Z',
    })
    occurredAt?: string
}