import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResidentReviewAction } from '@prisma/client';

export class ResidentSelfOnboardingDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    first_name!: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    last_name!: string;

    @ApiProperty({ example: 'Oyo' })
    @IsString()
    state_of_origin!: string;

    @ApiProperty({ example: 'Ogbomoso North' })
    @IsString()
    lga!: string;

    @ApiProperty({ example: 'A12' })
    @IsString()
    houseNumber!: string;

    // @ApiProperty({ example: '12 Palm Street, Lekki Phase 1' })
    // @IsString()
    // @IsOptional
    // residentAddress!: string

    @ApiProperty({ example: '08012345678' })
    @IsString()
    @Length(10, 11, {
        message: 'WhatsApp phone number must be between 10 and 11 characters',
    })
    whatsappPhone!: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'A' })
    @IsOptional()
    @IsString()
    block?: string;

    @ApiPropertyOptional({ example: 'estate-street-id' })
    @IsOptional()
    @IsString()
    streetId?: string;

    @ApiPropertyOptional({ example: 'apartment-type-id' })
    @IsOptional()
    @IsString()
    apartmentTypeId?: string;
}

export class CreateResidentDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    first_name!: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    last_name!: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '08012345678' })
    @IsString()
    phone!: string;

    @ApiProperty({ example: '12' })
    @IsString()
    house_no!: string;

    @ApiProperty({ example: 'A' })
    @IsString()
    block!: string;

    @ApiPropertyOptional({ example: 'estate-street-id' })
    @IsOptional()
    @IsString()
    streetId?: string;

    @ApiPropertyOptional({ example: 'apartment-type-id' })
    @IsOptional()
    @IsString()
    apartmentTypeId?: string;

    @ApiPropertyOptional({ example: 'Male' })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentDataProcessing!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentIdentity!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentThirdParty!: boolean;
}

export class NinVerificationDto {
    @IsString()
    @Length(11, 13)
    @ApiProperty({ example: '63184876213' })
    idNumber!: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    firstname!: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastname!: string;

    // @IsOptional()
    // @IsString()
    // @ApiProperty({ example: process.env.DEFAULT_FACE_CAPTURE_URL })
    // face_capture?: string;
}

export class CompleteResidentProfileDto {
    @ApiPropertyOptional({ example: 'NIN' })
    @IsOptional()
    @IsString()
    id_type!: string;

    @ApiPropertyOptional({ example: '12345678901' })
    @IsOptional()
    @IsString()
    id_no!: string;

    @ApiPropertyOptional({ example: 'https://cloudinary.com/front.jpg' })
    @IsOptional()
    @IsString()
    id_document_front?: string;

    @ApiPropertyOptional({ example: 'https://cloudinary.com/back.jpg' })
    @IsOptional()
    @IsString()
    id_document_back?: string;

    @ApiPropertyOptional({ example: '22334455667' })
    @IsOptional()
    @IsString()
    bvn?: string;

    @ApiPropertyOptional({ example: '12345678901' })
    @IsOptional()
    @IsString()
    @Length(11, 11)
    nin?: string;

    @ApiPropertyOptional({ example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    next_of_kin_name?: string;

    @ApiPropertyOptional({ example: '08011223344' })
    @IsOptional()
    @IsString()
    next_of_kin_phone?: string;

    @ApiPropertyOptional({ example: 'jane@example.com' })
    @IsOptional()
    @IsEmail()
    next_of_kin_email?: string;

    @ApiPropertyOptional({ example: 'Sister' })
    @IsOptional()
    @IsString()
    next_of_kin_relationship?: string;

    @ApiPropertyOptional({ example: 'Mr Adewale' })
    @IsOptional()
    @IsString()
    guarantor_name?: string;

    @ApiPropertyOptional({ example: 'Engineer' })
    @IsOptional()
    @IsString()
    guarantor_occupation?: string;

    @ApiPropertyOptional({ example: 'Victoria Island' })
    @IsOptional()
    @IsString()
    guarantor_work_address?: string;

    @ApiPropertyOptional({ example: '99887766554' })
    @IsOptional()
    @IsString()
    guarantor_id_no?: string;

    @ApiPropertyOptional({ example: 'Uncle' })
    @IsOptional()
    @IsString()
    guarantor_id_relationship?: string;

    @ApiPropertyOptional({ example: 'https://cloudinary.com/letter.pdf' })
    @IsOptional()
    @IsString()
    signed_guarantor_letter_upload?: string;

    @ApiPropertyOptional({ example: 'ABC-123XY' })
    @IsOptional()
    @IsString()
    vehicle_plate_no?: string;

    @ApiPropertyOptional({ example: 'Toyota Camry' })
    @IsOptional()
    @IsString()
    vehicle_make?: string;

    @ApiPropertyOptional({ example: 'Black' })
    @IsOptional()
    @IsString()
    vehicle_color?: string;

    @ApiPropertyOptional({ example: 'https://cloudinary.com/proof.pdf' })
    @IsOptional()
    @IsString()
    proof_of_address_upload?: string;

    @ApiPropertyOptional({ example: 'https://cloudinary.com/passport.jpg' })
    @IsOptional()
    @IsString()
    passport?: string;

    // @ApiPropertyOptional({ example: 'https://cloudinary.com/tenancy.pdf' })
    // @IsOptional()
    // @IsString()
    // tenancy_ownership_doc?: string

    // @ApiPropertyOptional({ example: 'Lekki Phase 1, Lagos' })
    // @IsOptional()
    // @IsString()
    // home_address?: string

    // @ApiPropertyOptional({ example: 'estate-street-id' })
    // @IsOptional()
    // @IsString()
    // streetId?: string

    // @ApiPropertyOptional({ example: 'Lagos' })
    // @IsOptional()
    // @IsString()
    // state_of_origin?: string

    // @ApiPropertyOptional({ example: 'Eti-Osa' })
    // @IsOptional()
    // @IsString()
    // lga?: string

    @ApiPropertyOptional({ example: '08099887766' })
    @IsOptional()
    @IsString()
    alternate_phone?: string;

    @ApiPropertyOptional({ example: 'apartment-type-id' })
    @IsOptional()
    @IsString()
    apartmentTypeId?: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentDataProcessing!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentIdentity!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    ndprConsentThirdParty!: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    profileDeclaration!: boolean;
}

export class ReviewResidentKycDto {
    @ApiProperty({
        enum: ResidentReviewAction,
        example: ResidentReviewAction.APPROVE,
    })
    @IsEnum(ResidentReviewAction)
    action!: ResidentReviewAction;

    @ApiPropertyOptional({
        example: 'Uploaded ID document is not readable',
    })
    @IsOptional()
    @IsString()
    rejectionReason?: string;
}
