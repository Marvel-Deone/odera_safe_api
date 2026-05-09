import {
    IsString,
    IsOptional,
    IsEmail,
    IsBoolean,
    Length,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateResidentDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    first_name!: string

    @ApiProperty({ example: 'Doe' })
    @IsString()
    last_name!: string

    @ApiProperty({ example: '1995-06-15' })
    @IsString()
    dob!: string

    @ApiProperty({ example: 'Male' })
    @IsString()
    gender!: string

    @ApiProperty({ example: '08012345678' })
    @IsString()
    phone!: string

    @ApiPropertyOptional({ example: '08087654321' })
    @IsOptional()
    @IsString()
    alternate_phone?: string

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string

    @ApiProperty({ example: '12' })
    @IsString()
    house_no!: string

    @ApiProperty({ example: 'A' })
    @IsString()
    block!: string

    @ApiProperty({ example: '12 Lekki Phase 2' })
    @IsString()
    home_address!: string

    @ApiProperty({ example: 'Lagos' })
    @IsString()
    state_of_origin!: string

    @ApiProperty({ example: 'Eti-Osa' })
    @IsString()
    lga!: string

    @ApiProperty({ example: 'NIN' })
    @IsString()
    id_type!: string

    @ApiProperty({ example: '12345678901' })
    @IsString()
    id_no!: string

    @ApiProperty({ example: 'https://cloudinary.com/front.jpg' })
    @IsString()
    id_document_front!: string

    @ApiProperty({ example: 'https://cloudinary.com/back.jpg' })
    @IsString()
    id_document_back!: string

    @ApiPropertyOptional({ example: '22334455667' })
    @IsOptional()
    @IsString()
    bvn?: string

    @ApiPropertyOptional({ example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    next_of_kin_name?: string

    @ApiPropertyOptional({ example: '08011223344' })
    @IsOptional()
    @IsString()
    next_of_kin_phone?: string

    @ApiPropertyOptional({ example: 'jane@example.com' })
    @IsOptional()
    @IsEmail()
    next_of_kin_email?: string

    @ApiPropertyOptional({ example: 'Sister' })
    @IsOptional()
    @IsString()
    next_of_kin_relationship?: string

    @ApiProperty({ example: 'Mr Adewale' })
    @IsString()
    guarantor_name!: string

    @ApiProperty({ example: 'Engineer' })
    @IsString()
    guarantor_occupation!: string

    @ApiProperty({ example: 'Victoria Island' })
    @IsString()
    guarantor_work_address!: string

    @ApiProperty({ example: '99887766554' })
    @IsString()
    guarantor_id_no!: string

    @ApiProperty({ example: 'Uncle' })
    @IsString()
    guarantor_id_relationship!: string

    @ApiProperty({ example: 'https://cloudinary.com/letter.pdf' })
    @IsString()
    signed_guarantor_letter_upload!: string

    @ApiProperty({ example: 'ABC-123XY' })
    @IsString()
    vehicle_plate_no!: string

    @ApiProperty({ example: 'Toyota Camry' })
    @IsString()
    vehicle_make!: string

    @ApiPropertyOptional({ example: 'Black' })
    @IsOptional()
    @IsString()
    vehicle_color?: string

    @ApiProperty({ example: 'https://cloudinary.com/proof.pdf' })
    @IsString()
    proof_of_address_upload!: string

    @ApiProperty({ example: 'https://cloudinary.com/passport.jpg' })
    @IsString()
    passport!: string

    @ApiProperty({ example: 'https://cloudinary.com/tenancy.pdf' })
    @IsString()
    tenancy_ownership_doc!: string

    @ApiPropertyOptional({ example: '123456' })
    @IsOptional()
    @Length(6, 6)
    @IsString()
    wallet_pin?: string

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentDataProcessing!: boolean

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentIdentity!: boolean

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentThirdParty!: boolean
}