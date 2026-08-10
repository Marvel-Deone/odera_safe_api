import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator'

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
  @IsEmail()
  email!: string;
}

export class VerifyForgotPasswordOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit number',
  })
  otp!: string;
}

export class ResetPasswordDto {
  @IsString()
  resetToken!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}