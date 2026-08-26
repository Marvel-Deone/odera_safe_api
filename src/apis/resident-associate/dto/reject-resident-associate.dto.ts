import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectResidentAssociateDto {
    @ApiPropertyOptional({
        example:
            'Submitted identification document could not be verified.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    rejectionReason?: string;
}