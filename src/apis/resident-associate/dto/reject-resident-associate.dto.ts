import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class RejectResidentAssociatesDto {
    @ApiProperty({
        example: ['associate-id-1', 'associate-id-2'],
        description:
            'One or more resident associate IDs to reject',
        type: [String],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    associateIds!: string[];

    @ApiPropertyOptional({
        example:
            'Submitted identification document could not be verified.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    rejectionReason?: string;
}