import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'
import * as bcrypt from 'bcrypt'
import { ChangePasswordDto, ChangePinDto, LoginDto, ResetPinDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
            include: {
                resident: true,
            },
        })

        if (!user) {
            return error(
                'Authentication Failed',
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            )
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        )

        if (!isPasswordValid) {
            return error(
                'Authentication Failed',
                'Invalid credentials',
                HttpStatus.UNAUTHORIZED,
            )
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            estateId: user.estateId,
        })

        return success(
            {
                accessToken: token,
                first_login: user.first_login,
                user,
            },
            'Login Successful',
            'User logged in successfully',
            HttpStatus.OK,
        )
    }

    async profile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                resident: true,
            },
        })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            user,
            'Profile Fetched',
            'User profile fetched successfully',
        )
    }

    async changePassword(
        userId: string,
        dto: ChangePasswordDto,
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const isMatch = await bcrypt.compare(
            dto.currentPassword,
            user.password,
        )

        if (!isMatch) {
            return error(
                'Authentication Failed',
                'Current password is incorrect',
                HttpStatus.BAD_REQUEST,
            )
        }

        const hashedPassword = await bcrypt.hash(
            dto.newPassword,
            10,
        )

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
                first_login: false,
            },
        })

        return success(
            null,
            'Password Changed',
            'Password changed successfully',
        )
    }

    async changePin(userId: string, dto: ChangePinDto) {
        const resident = await this.prisma.resident.findFirst({
            where: {
                userId,
            },
        })

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        if (!resident.wallet_pin) {
            return error(
                'PIN Error',
                'No existing PIN found',
                HttpStatus.BAD_REQUEST,
            )
        }

        const isMatch = await bcrypt.compare(
            dto.currentPin,
            resident.wallet_pin,
        )

        if (!isMatch) {
            return error(
                'Authentication Failed',
                'Current PIN is incorrect',
                HttpStatus.BAD_REQUEST,
            )
        }

        const hashedPin = await bcrypt.hash(dto.newPin, 10)

        await this.prisma.resident.update({
            where: {
                id: resident.id,
            },
            data: {
                wallet_pin: hashedPin,
            },
        })

        return success(
            null,
            'PIN Changed',
            'Wallet PIN changed successfully',
        )
    }

    async resetPin(userId: string, dto: ResetPinDto) {
        const resident = await this.prisma.resident.findFirst({
            where: {
                userId,
            },
        })

        if (!resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const hashedPin = await bcrypt.hash(dto.newPin, 10)

        await this.prisma.resident.update({
            where: {
                id: resident.id,
            },
            data: {
                wallet_pin: hashedPin,
            },
        })

        return success(
            null,
            'PIN Reset',
            'Wallet PIN reset successfully',
        )
    }
}