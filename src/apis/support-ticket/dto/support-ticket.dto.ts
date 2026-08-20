import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SupportTicketCategory, TicketPriority } from '@prisma/client';

export class CreateSupportTicketDto {
    @ApiProperty({
        example: 'I cannot access my dashboard',
    })
    @IsString()
    title!: string;

    @ApiProperty({
        example: 'The dashboard shows an error whenever I try to open it.',
    })
    @IsString()
    description!: string;

    @ApiProperty({
        enum: SupportTicketCategory,
        example: SupportTicketCategory.APP_ISSUE,
    })
    @IsEnum(SupportTicketCategory)
    category!: SupportTicketCategory;

    @ApiProperty({
        required: false,
        enum: TicketPriority,
        default: TicketPriority.P3_ROUTINE,
    })
    @IsOptional()
    @IsEnum(TicketPriority)
    priority?: TicketPriority;
}

export class ResolveSupportTicketDto {
    @ApiProperty({
        example: 'The dashboard issue was fixed and access has been restored.',
    })
    @IsString()
    resolutionNote!: string;
}

export class CancelSupportTicketDto {
    @ApiProperty({
        example: 'Duplicate ticket. The issue is already being handled.',
    })
    @IsString()
    cancellationNote!: string;
}
