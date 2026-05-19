import { ShiftSwapReason } from '@prisma/client'
import {
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator'

export class CreateShiftSwapDto {
    @IsUUID()
    requesterShiftId!: string

    @IsUUID()
    targetGuardId!: string

    @IsUUID()
    targetShiftId!: string

    @IsString()
    reason!: ShiftSwapReason

    @IsOptional()
    @IsString()
    details?: string
}

export class RejectShiftSwapDto {
    @IsOptional()
    @IsString()
    rejectionReason?: string
}