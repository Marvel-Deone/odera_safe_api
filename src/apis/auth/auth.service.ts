import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';
import * as bcrypt from 'bcrypt';
import {
    ChangePasswordDto,
    ChangePinDto,
    ForgotPasswordDto,
    LoginDto,
    ResetPinDto,
    VerifyForgotPasswordOtpDto,
} from './dto/auth.dto';
import { EmailService } from '../../shared/email.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            include: {
                resident: true,
                residentAssociate: true,
            },
        });

        if (!user) {
            return error(
                'Authentication Failed',
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!isPasswordValid) {
            return error(
                'Authentication Failed',
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            estateId: user.estateId,
            first_login: user.first_login,
        });

        return success(
            {
                accessToken: token,
                first_login: user.first_login,
                user,
            },
            'Login Successful',
            'User logged in successfully',
            HttpStatus.OK,
        );
    }

    async profile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                resident: true,
                residentAssociate: true,
            },
        });

        if (!user) {
            return error('Not Found', 'User not found', HttpStatus.NOT_FOUND);
        }

        return success(
            user,
            'Profile Fetched',
            'User profile fetched successfully',
        );
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const email = dto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return success(
                null,
                'OTP Sent',
                'If an account exists with this email, a password reset OTP has been sent.',
            );
        }

        // Invalidate any previous OTPs
        await this.prisma.passwordResetOtp.updateMany({
            where: {
                userId: user.id,
                verified: false,
            },
            data: {
                expiresAt: new Date(),
            },
        });

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        const otpHash = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000,
        );

        await this.prisma.passwordResetOtp.create({
            data: {
                userId: user.id,
                otpHash,
                expiresAt,
            },
        });

        await this.emailService.sendPasswordResetOtpEmail({
            toEmail: user.email,
            // fullName: user.first_name
            //     ? `${user.first_name} ${user.last_name ?? ''}`.trim()
            //     : undefined,
            otp,
        });

        return success(
            null,
            'OTP Sent',
            'If an account exists with this email, a password reset OTP has been sent.',
        );
    }

    async verifyForgotPasswordOtp(dto: VerifyForgotPasswordOtpDto) {
        const email = dto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return error(
                'Invalid OTP',
                'The OTP is invalid or has expired',
                HttpStatus.BAD_REQUEST,
            );
        }

        const otpRecord = await this.prisma.passwordResetOtp.findFirst({
            where: {
                userId: user.id,
                verified: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!otpRecord) {
            return error(
                'Invalid OTP',
                'The OTP is invalid or has expired',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Limit OTP attempts
        if (otpRecord.attempts >= 5) {
            await this.prisma.passwordResetOtp.update({
                where: {
                    id: otpRecord.id,
                },
                data: {
                    expiresAt: new Date(),
                },
            });

            return error(
                'Too Many Attempts',
                'Too many incorrect OTP attempts. Please request a new OTP.',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        const isValid = await bcrypt.compare(
            dto.otp,
            otpRecord.otpHash,
        );

        if (!isValid) {
            await this.prisma.passwordResetOtp.update({
                where: {
                    id: otpRecord.id,
                },
                data: {
                    attempts: {
                        increment: 1,
                    },
                },
            });

            return error(
                'Invalid OTP',
                'The OTP is invalid or has expired',
                HttpStatus.BAD_REQUEST,
            );
        }

        //  Mark OTP as verified.
        await this.prisma.passwordResetOtp.update({
            where: {
                id: otpRecord.id,
            },
            data: {
                verified: true,
            },
        });

        //   Generate a short-lived reset token.
        //  This token is only for changing the password.
        const resetToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                purpose: 'password_reset',
                otpId: otpRecord.id,
            },
            {
                expiresIn: '10m',
            },
        );

        return success(
            {
                resetToken,
            },
            'OTP Verified',
            'OTP verified successfully. You can now reset your password.',
        );
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return error('Not Found', 'User not found', HttpStatus.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(
            dto.currentPassword,
            user.password,
        );

        if (!isMatch) {
            return error(
                'Authentication Failed',
                'Current password is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
                first_login: false,
            },
        });

        return success(
            null,
            'Password Changed',
            'Password changed successfully',
        );
    }

    async changePin(userId: string, dto: ChangePinDto) {
        const resident = await this.prisma.resident.findFirst({
            where: {
                userId,
            },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (!resident.wallet_pin) {
            return error(
                'PIN Error',
                'No existing PIN found',
                HttpStatus.BAD_REQUEST,
            );
        }

        const isMatch = await bcrypt.compare(
            dto.currentPin,
            resident.wallet_pin,
        );

        if (!isMatch) {
            return error(
                'Authentication Failed',
                'Current PIN is incorrect',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPin = await bcrypt.hash(dto.newPin, 10);

        await this.prisma.resident.update({
            where: {
                id: resident.id,
            },
            data: {
                wallet_pin: hashedPin,
            },
        });

        return success(null, 'PIN Changed', 'Wallet PIN changed successfully');
    }

    async resetPin(userId: string, dto: ResetPinDto) {
        const resident = await this.prisma.resident.findFirst({
            where: {
                userId,
            },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const hashedPin = await bcrypt.hash(dto.newPin, 10);

        await this.prisma.resident.update({
            where: {
                id: resident.id,
            },
            data: {
                wallet_pin: hashedPin,
            },
        });

        return success(null, 'PIN Reset', 'Wallet PIN reset successfully');
    }
}
