import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsString,
} from 'class-validator';

export class ApproveResidentAssociatesDto {
    @ApiProperty({
        example: ['associate-id-1', 'associate-id-2'],
        description:
            'One or more resident associate IDs to approve',
        type: [String],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    associateIds!: string[];
}