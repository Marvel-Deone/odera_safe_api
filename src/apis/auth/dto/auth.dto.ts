import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, Length, Matches, MinLength, IsUUID } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    example: 'resident@mail.com',
  })
  @IsEmail()
  email!: string

  @ApiProperty({
    example: 'Password123',
  })
  @IsString()
  @MinLength(6)
  password!: string
}

export class UpdateProfileDto {

  @ApiPropertyOptional({

    example: 'John',

  })

  @IsOptional()

  @IsString()

  first_name?: string

  @ApiPropertyOptional({

    example: 'Doe',

  })

  @IsOptional()

  @IsString()

  last_name?: string

  @ApiPropertyOptional({

    example: '08012345678',

  })

  @IsOptional()

  @IsString()

  @Matches(/^[0-9+\-\s()]{7,20}$/, {

    message: 'Please provide a valid phone number',

  })

  phone?: string

  @ApiPropertyOptional({

    example: 'Male'
  })

  @IsOptional()

  @IsString()

  gender?: string

  @ApiPropertyOptional({

    example: '12A',

  })

  @IsOptional()

  @IsString()

  house_no?: string

  @ApiPropertyOptional({

    example: 'Block A',

  })

  @IsOptional()

  @IsString()

  block?: string

  @ApiPropertyOptional({

    example: '12A Block A, Banana Estate',

  })

  @IsOptional()

  @IsString()

  home_address?: string

  @ApiPropertyOptional({

    example: 'Lagos',

  })

  @IsOptional()

  @IsString()

  state_of_origin?: string

  @ApiPropertyOptional({

    example: 'Ikeja',

  })

  @IsOptional()

  @IsString()

  lga?: string

  @ApiPropertyOptional({

    example: '08123456789',

  })

  @IsOptional()

  @IsString()

  @Matches(/^[0-9+\-\s()]{7,20}$/, {

    message: 'Please provide a valid phone number',

  })

  alternate_phone?: string

  @ApiPropertyOptional({

    example: 'uuid-of-apartment-type',

  })

  @IsOptional()

  @IsUUID()

  apartmentTypeId?: string
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Password123',
  })
  @IsString()
  currentPassword!: string

  @ApiProperty({
    example: 'NewPassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string
}

export class ChangePinDto {
  @ApiProperty({
    example: '1234',
  })
  @IsString()
  currentPin!: string

  @ApiProperty({
    example: '5678',
  })
  @IsString()
  @Length(4, 4)
  newPin!: string
}

export class ResetPinDto {
  @ApiProperty({
    example: '1234',
  })
  @IsString()
  @Length(4, 6)
  newPin!: string
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'resident@mail.com',
  })
  @IsEmail()
  email!: string;
}

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 'resident@mail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '423568',
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit number',
  })
  otp!: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'token1234567890',
  })
  @IsString()
  resetToken!: string;

  @ApiProperty({
    example: 'NewPassword123',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
