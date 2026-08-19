import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    UseGuards,
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { ChangePasswordDto, ChangePinDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, ResetPinDto, VerifyForgotPasswordOtpDto, UpdateProfileDto } from './dto/auth.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { Role } from '@prisma/client'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login user',
    })
    @ApiBody({
        type: LoginDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
    })
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    // profile
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user profile',
        description:
            'Returns authenticated user profile information',
    })
    @ApiResponse({
        status: 200,
        description: 'Profile fetched successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async profile(@CurrentUser() user: any) {
        return this.authService.profile(user.id)
    }

@Patch('profile')
@ApiBearerAuth()
@ApiOperation({
    summary: 'Update user profile',
})
async updateProfile(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateProfileDto,
) {
    return this.authService.updateProfile(user.id, dto);
}

    // change password
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Change password',
        description:
            'Allows authenticated user to change password',
    })
    @ApiBody({
        type: ChangePasswordDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Current password incorrect',
    })
    async changePassword(
        @CurrentUser() user: any,
        @Body() dto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(user.id, dto)
    }

    @Post('forgot-password')
    @ApiOperation({
        summary: 'Request password reset OTP',
    })
    forgotPassword(
        @Body() dto: ForgotPasswordDto,
    ) {
        return this.authService.forgotPassword(dto);
    }

    @Post('verify-forgot-password-otp')
    @ApiOperation({
        summary: 'Verify password reset OTP',
    })
    verifyForgotPasswordOtp(
        @Body() dto: VerifyForgotPasswordOtpDto,
    ) {
        return this.authService.verifyForgotPasswordOtp(dto);
    }

    @Post('reset-password')
    @ApiOperation({
        summary: 'Reset password using verified OTP',
    })
    resetPassword(
        @Body() dto: ResetPasswordDto,
    ) {
        return this.authService.resetPassword(dto);
    }

    // CHANGE PIN
    @Post('change-pin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Change wallet PIN',
        description:
            'Allows resident to change existing wallet PIN',
    })
    @ApiBody({
        type: ChangePinDto,
    })
    @ApiResponse({
        status: 200,
        description: 'PIN changed successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Current PIN incorrect',
    })
    async changePin(
        @CurrentUser() user: any,
        @Body() dto: ChangePinDto,
    ) {
        return this.authService.changePin(user.id, dto)
    }

    // RESET PIN
    @Post('reset-pin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset wallet PIN',
        description:
            'Allows resident to reset wallet PIN',
    })
    @ApiBody({
        type: ResetPinDto,
    })
    @ApiResponse({
        status: 200,
        description: 'PIN reset successfully',
    })
    async resetPin(
        @CurrentUser() user: any,
        @Body() dto: ResetPinDto,
    ) {
        return this.authService.resetPin(user.id, dto)
    }
}
