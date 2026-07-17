import {
    IsString,
    IsOptional,
    IsEmail,
    IsBoolean,
    IsEnum,
} from 'class-validator'
import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger'
import { GuardRole } from '@prisma/client'

export class CreateGuardDto {
    @ApiProperty({
        example: 'guard@example.com',
    })
    @IsEmail()
    email!: string

    @ApiProperty({
        enum: GuardRole,
        example: GuardRole.GUARD,
    })
    @IsEnum(GuardRole)
    role!: GuardRole

    @ApiProperty({
        example: 'John Doe',
    })
    @IsString()
    full_name!: string

    @ApiProperty({
        example: '08012345678',
    })
    @IsString()
    phone!: string

    @ApiPropertyOptional({
        example: 'Zone A',
    })
    @IsOptional()
    @IsString()
    zone_assignment?: string

    @ApiPropertyOptional({
        example: 'Day Shift',
    })
    @IsOptional()
    @IsString()
    shift_pattern?: string

    @ApiPropertyOptional({
        example: '4 Days On / 2 Days Off',
    })
    @IsOptional()
    @IsString()
    duty_cycle?: string

    @ApiPropertyOptional({
        example: '2025-01-15',
    })
    @IsOptional()
    @IsString()
    resumption_date?: string

    @ApiPropertyOptional({
        example: 'NIN',
    })
    @IsOptional()
    @IsString()
    government_id_type?: string

    @ApiPropertyOptional({
        example: '12345678901',
    })
    @IsOptional()
    @IsString()
    government_id_no?: string

    @ApiPropertyOptional({
        example: '12345678901',
    })
    @IsOptional()
    @IsString()
    nin?: string

    @ApiPropertyOptional({
        example: '1.80m',
    })
    @IsOptional()
    @IsString()
    height?: string

    @ApiPropertyOptional({
        example: 'Athletic',
    })
    @IsOptional()
    @IsString()
    build?: string

    @ApiPropertyOptional({
        example: 'Scar on left cheek',
    })
    @IsOptional()
    @IsString()
    distinguishing_marks?: string

    @ApiPropertyOptional({
        example: 'Jane Doe',
    })
    @IsOptional()
    @IsString()
    nok_name?: string

    @ApiPropertyOptional({
        example: '08098765432',
    })
    @IsOptional()
    @IsString()
    nok_phone?: string

    @ApiPropertyOptional({
        example: 'Sister',
    })
    @IsOptional()
    @IsString()
    nok_relationship?: string

    @ApiPropertyOptional({
        example: 'Mr Adewale',
    })
    @IsOptional()
    @IsString()
    guarantor_name?: string

    @ApiPropertyOptional({
        example: '08011223344',
    })
    @IsOptional()
    @IsString()
    guarantor_phone?: string

    @ApiPropertyOptional({
        example: 'Engineer',
    })
    @IsOptional()
    @IsString()
    guarantor_occupation?: string

    @ApiPropertyOptional({
        example: 'Victoria Island, Lagos',
    })
    @IsOptional()
    @IsString()
    guarantor_work_address?: string

    @ApiPropertyOptional({
        example: '12345678901',
    })
    @IsOptional()
    @IsString()
    guarantor_nin?: string

    @ApiPropertyOptional({
        example: 'Uncle',
    })
    @IsOptional()
    @IsString()
    guarantor_relationship?: string

    @ApiPropertyOptional({
        example: 'Level 2',
    })
    @IsOptional()
    @IsString()
    salary_band?: string

    @ApiPropertyOptional({
        example: 'GTBank',
    })
    @IsOptional()
    @IsString()
    bank_name?: string

    @ApiPropertyOptional({
        example: '0123456789',
    })
    @IsOptional()
    @IsString()
    account_number?: string

    @ApiPropertyOptional({
        example: 'John Doe',
    })
    @IsOptional()
    @IsString()
    account_name?: string

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    first_aid?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    fire_safety?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    qr_gate_ops?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    biometric_capture?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    crisis_response?: boolean

    @ApiPropertyOptional({
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    female_screening?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    self_defence?: boolean

    @ApiPropertyOptional({
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    cctv_operation?: boolean
}
