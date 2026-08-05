import {
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SosActionDto {
    @ApiPropertyOptional({
        example: 'Action taken after reviewing the incident',
    })
    @IsOptional()
    @IsString()
    @MaxLength(2_000)
    note?: string;
}

export class AcknowledgeSosDto extends SosActionDto {}

export class EscalateSosDto extends SosActionDto {}

export class SilenceSosDto extends SosActionDto {}

export class ResolveSosDto extends SosActionDto {}

export class MarkSosFalseAlarmDto extends SosActionDto {}

export class CloseSosDto extends SosActionDto {}

export class CancelSosDto extends SosActionDto {}

export class TriggerSosAlarmDto extends SosActionDto {}

export class UpdateSosLocationDto {
    @ApiProperty({ example: 6.5244 })
    @IsLatitude()
    latitude!: number;

    @ApiProperty({ example: 3.3792 })
    @IsLongitude()
    longitude!: number;

    @ApiPropertyOptional({
        example: 'Reporter is moving toward Gate C',
    })
    @IsOptional()
    @IsString()
    @MaxLength(250)
    note?: string;
}

export class StartSosLiveStreamDto {
    @ApiProperty({
        example: 'https://stream.example.com/live/session-token',
    })
    @IsUrl({ require_protocol: true })
    streamUrl!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(250)
    note?: string;
}

export class StopSosLiveStreamDto extends SosActionDto {}