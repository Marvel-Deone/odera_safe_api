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
    ResetPasswordDto,
    ResetPinDto,
    VerifyForgotPasswordOtpDto,
    UpdateProfileDto,
} from './dto/auth.dto';
import { EmailService } from '../../shared/email.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    private async reconcileResidentLevyStatus(residentId: string) {
        const now = new Date();
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
            select: {
                id: true,
                kycStatus: true,
                approvedAt: true,
            },
        });

        if (!resident) {
            return;
        }

        if (
            resident.kycStatus !== 'COMPLETED' ||
            !resident.approvedAt
        ) {
            await this.prisma.resident.update({
                where: { id: resident.id },
                data: { levyCleared: true },
            });
            return;
        }

        const levyEnforcementAt = new Date(
            resident.approvedAt.getTime() + 24 * 60 * 60 * 1000,
        );

        if (now < levyEnforcementAt) {
            await this.prisma.resident.update({
                where: { id: resident.id },
                data: { levyCleared: true },
            });
            return;
        }

        const overdueAdminLevy = await this.prisma.levyAssignment.findFirst({
            where: {
                residentId: resident.id,
                status: { not: 'PAID' },
                levy: {
                    category: { not: 'MONTHLY_RESIDENT_LEVY' },
                    dueDate: { lte: now },
                },
            },
            select: { id: true },
        });

        await this.prisma.resident.update({
            where: { id: resident.id },
            data: { levyCleared: !overdueAdminLevy },
        });
    }

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

        // Reconcile levy enforcement on login so a resident who did not log
        // in when the levy became due still gets the correct access state.
        if (user.resident) {
            await this.reconcileResidentLevyStatus(user.resident.id);

            user.resident = await this.prisma.resident.findUnique({
                where: { id: user.resident.id },
            });
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
            resident: {
                include: {
                    apartmentType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
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

    async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            resident: true,
        },
    });

    if (!user) {
        return error(
            'Not Found',
            'User not found',
            HttpStatus.NOT_FOUND,
        );
    }

    if (!user.resident) {
        return error(
            'Not Found',
            'Resident profile not found',
            HttpStatus.NOT_FOUND,
        );
    }

    // Validate apartment type if supplied
    if (dto.apartmentTypeId) {
        const apartmentType =
            await this.prisma.apartmentType.findFirst({
                where: {
                    id: dto.apartmentTypeId,
                    estateId: user.estateId,
                    active: true,
                },
            });

        if (!apartmentType) {
            return error(
                'Bad Request',
                'Invalid apartment type',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    const updatedUser = await this.prisma.$transaction(
        async (tx) => {
            // Update Resident
            await tx.resident.update({
                where: {
                    userId: userId,
                },
                data: {
                    ...(dto.first_name !== undefined && {
                        first_name: dto.first_name,
                    }),

                    ...(dto.last_name !== undefined && {
                        last_name: dto.last_name,
                    }),

                    ...(dto.phone !== undefined && {
                        phone: dto.phone,
                    }),

                    ...(dto.gender !== undefined && {
                        gender: dto.gender,
                    }),

                    ...(dto.house_no !== undefined && {
                        house_no: dto.house_no,
                    }),

                    ...(dto.block !== undefined && {
                        block: dto.block,
                    }),

                    ...(dto.home_address !== undefined && {
                        home_address: dto.home_address,
                    }),

                    ...(dto.state_of_origin !== undefined && {
                        state_of_origin: dto.state_of_origin,
                    }),

                    ...(dto.lga !== undefined && {
                        lga: dto.lga,
                    }),

                    ...(dto.alternate_phone !== undefined && {
                        alternate_phone: dto.alternate_phone,
                    }),

                    ...(dto.apartmentTypeId !== undefined && {
                        apartmentTypeId: dto.apartmentTypeId,
                    }),
                },
            });

            return tx.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    resident: {
                        include: {
                            apartmentType: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    residentAssociate: true,
                },
            });
        },
    );

    return success(
        updatedUser,
        'Profile Updated',
        'User profile updated successfully',
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

    async resetPassword(dto: ResetPasswordDto) {
        let payload: {
            sub: string;
            purpose: string;
            otpId: string;
        };

        try {
            payload = await this.jwtService.verifyAsync(
                dto.resetToken,
            );
        } catch {
            return error(
                'Invalid Reset Token',
                'The password reset session is invalid or has expired.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (payload.purpose !== 'password_reset') {
            return error(
                'Invalid Reset Token',
                'Invalid password reset token.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const otpRecord =
            await this.prisma.passwordResetOtp.findUnique({
                where: {
                    id: payload.otpId,
                },
            });

        if (!otpRecord) {
            return error(
                'Invalid Reset Token',
                'Password reset session is invalid.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (!otpRecord.verified) {
            return error(
                'OTP Not Verified',
                'Please verify your OTP before resetting your password.',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (otpRecord.expiresAt < new Date()) {
            return error(
                'Reset Expired',
                'The password reset session has expired. Please request a new OTP.',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        if (!user) {
            return error(
                'Not Found',
                'User not found.',
                HttpStatus.NOT_FOUND,
            );
        }

        const hashedPassword = await bcrypt.hash(
            dto.newPassword,
            10,
        );

        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                    first_login: false,
                },
            });

            // Consume the OTP
            await tx.passwordResetOtp.delete({
                where: {
                    id: otpRecord.id,
                },
            });
        });

        return success(
            null,
            'Password Reset',
            'Your password has been reset successfully. You can now log in.',
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
