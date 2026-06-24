import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'

import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger'

import { GuardRole, Role } from '@prisma/client'

import { VisitorService } from './visitor.service'

import { Roles } from '../auth/decorators/roles.decorator'

import { CurrentUser } from '../auth/decorators/current-user.decorator'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'

import { CreateVisitorDto, UpdateVisitorDto } from './dto/visitor.dto'

@ApiTags('Visitor Management')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)

@Controller('visitors')
export class VisitorController {
    constructor(
        private readonly visitorService: VisitorService,
    ) { }

    // RESIDENT ROUTES
    @Post()
    @Roles(Role.RESIDENT)

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Create visitor invitation',
    })
    async createVisitor(
        @CurrentUser() user: any,

        @Body()
        dto: CreateVisitorDto,
    ) {
        return this.visitorService.createVisitor(
            user.id,
            dto,
        )
    }

    @Get()
    @Roles(Role.RESIDENT)

    @ApiOperation({
        summary:
            'Get resident visitors',
    })
    async getMyVisitors(
        @CurrentUser() user: any,
    ) {
        return this.visitorService.getResidentVisitors(
            user.id,
        )
    }

    @Get('validate/:code')
    @Roles(
        Role.GUARD,
        GuardRole.SUPER_GUARD as unknown as Role,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )

    @ApiOperation({
        summary:
            'Validate visitor pass',
    })
    async validateVisitor(
        @Param('code')
        code: string,
    ) {
        return this.visitorService.validateVisitor(
            code,
        )
    }

    // CHECK IN
    @Post('check-in/:code')
    @Roles(
        Role.GUARD,
        GuardRole.SUPER_GUARD as unknown as Role,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Check-in visitor',
    })
    async checkIn(
        @Param('code')
        code: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.checkIn(
            code,
            user.id,
        )
    }

    //  CHECK OUT
    @Post('check-out/:code')
    @Roles(
        Role.GUARD,
        GuardRole.SUPER_GUARD as unknown as Role,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Check-out visitor',
    })
    async checkOut(
        @Param('code')
        code: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.checkOut(
            code,
            user.id,
        )
    }

    // QR SCAN
    //  qrData = base64 encoded payload

    @Post('scan')
    @Roles(
        Role.GUARD,
        GuardRole.SUPER_GUARD as unknown as Role,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Scan QR and validate visitor',
    })
    async scanQR(
        @Body('qrData')
        qrData: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.scanQR(
            qrData,
            user.id,
        )
    }


    @Get(':visitorId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Fetch visitor by ID',
        description: 'Returns a single resident by ID',
    })
    @ApiParam({
        name: 'visitorId',
        required: true,
        example: 'a1b2c3d4-e5f6',
    })
    async getVisitorById(
        @CurrentUser() user: any,
        @Param('visitorId') visitorId: string,
    ) {
        return this.visitorService.getResidentVisitorById(user.id, visitorId)
    }

    @Patch(':visitorId')
    @Roles(Role.RESIDENT)

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary: 'Update visitor invitation',
    })
    async updateVisitor(
        @Param('visitorId')
        visitorId: string,

        @CurrentUser()
        user: any,

        @Body()
        dto: UpdateVisitorDto,
    ) {
        return this.visitorService.updateVisitor(
            visitorId,
            user.id,
            dto,
        )
    }

    // RESIDENT: REVOKE VISITOR
    @Patch(':visitorId/revoke')
    @Roles(Role.RESIDENT)

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Revoke visitor invitation',
    })
    async revokeVisitor(
        @Param('visitorId')
        visitorId: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.revokeVisitor(
            visitorId,
            user.id,
        )
    }

    @Post(':visitorId/qr-view')
    @Roles(Role.RESIDENT)

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary: 'Log QR view activity',
    })
    async logQRView(
        @Param('visitorId')
        visitorId: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.logQRView(
            visitorId,
            user.id,
        )
    }

    @Post(':visitorId/deny')

    @Roles(
        Role.GUARD,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )

    @HttpCode(HttpStatus.OK)

    @ApiOperation({
        summary:
            'Deny visitor access',
    })
    async denyVisitor(
        @Param('visitorId')
        visitorId: string,

        @CurrentUser()
        user: any,
    ) {
        return this.visitorService.denyVisitor(
            visitorId,
            user.id,
        )
    }
}
