import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
} from '@nestjs/swagger'

import { VisitorService } from './visitor.service'
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard/jwt-auth.guard'
// import { RolesGuard } from '../auth/guards/roles.guard/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'

@ApiTags('Visitor Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorController {
    constructor(private readonly visitorService: VisitorService) { }

    // resident route
    @Post()
    @Roles(Role.RESIDENT)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Create visitor invitation',
    })
    async createVisitor(
        @CurrentUser() user: any,
        @Body() dto: any,
    ) {
        return this.visitorService.createVisitor(user.id, dto)
    }

    @Get()
    @Roles(Role.RESIDENT)
    @ApiOperation({
        summary: 'Get all visitors for logged-in resident',
    })
    async getMyVisitors(@CurrentUser() user: any) {
        return this.visitorService.getResidentVisitors(user.id)
    }

    // guard routes
    @Get('validate/:visitorId')
    @Roles(Role.GUARD)
    @ApiOperation({
        summary: 'Validate visitor at gate',
    })
    async validateVisitor(@Param('visitorId') visitorId: string) {
        return this.visitorService.validateVisitor(visitorId)
    }

    @Post('check-in/:visitorId')
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Check-in visitor',
    })
    async checkIn(
        @Param('visitorId') visitorId: string,
        @CurrentUser() user: any,
    ) {
        return this.visitorService.checkIn(visitorId, user.id)
    }

    @Post('check-out/:visitorId')
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Check-out visitor',
    })
    async checkOut(
        @Param('visitorId') visitorId: string,
        @CurrentUser() user: any,
    ) {
        return this.visitorService.checkOut(visitorId, user.id)
    }

    @Post('scan')
    @Roles(Role.GUARD)
    @ApiOperation({ summary: 'Scan QR and check-in visitor' })
    async scanQR(
        @Body('qrData') qrData: string,
        @CurrentUser() user: any,
    ) {
        return this.visitorService.scanQR(qrData, user.id)
    }
}