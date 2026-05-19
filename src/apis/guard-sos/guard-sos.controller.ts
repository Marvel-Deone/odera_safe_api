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
import { GuardSosService } from './guard-sos.service'
import { CreateGuardSOSDto } from './dto/guard-sos.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Role } from '@prisma/client'
import { Roles } from '../auth/decorators/roles.decorator'

@ApiTags('Guards')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Controller('guard-sos')
export class GuardSosController {
    constructor(
        private readonly guardSosService: GuardSosService,
    ) { }

    @Post()
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Create guard sos alert',
    })
    createGuardSOS(
        @CurrentUser() user: any,
        @Body() dto: CreateGuardSOSDto,
    ) {
        return this.guardSosService.createGuardSOS(
            user.id,
            dto,
        )
    }

    @Get()
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get guard SOS alerts',
    })
    getGuardSOSAlerts(
        @CurrentUser() user: any,
    ) {
        return this.guardSosService.getGuardSOSAlerts(
            user.id,
        )
    }

    @Patch(':id/cancel')
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Cancel own SOS alert',
    })
    cancelGuardSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.guardSosService.cancelGuardSOS(
            user.id,
            id,
        )
    }

    /**
     * Get all SOS alerts in estate
     * GET /guard-sos
     */
    @Get('admin/alerts')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all SOS alerts',
    })
    getAllGuardSOSAlerts(
        @CurrentUser() user: any,
    ) {
        return this.guardSosService.getAllGuardSOSAlerts(
            user.id,
        )
    }

    @Get('admin/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get SOS alert by ID',
    })
    getGuardSOSById(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.guardSosService.getGuardSOSById(
            user.id,
            id,
        )
    }

    @Patch(':id/acknowledge')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Acknowledge SOS alert by ID',
    })
    acknowledgeGuardSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.guardSosService.acknowledgeGuardSOS(
            user.id,
            id,
        )
    }

    @Patch(':id/resolve')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Resolve SOS alert by ID',
    })
    resolveGuardSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body()
        dto: {
            resolutionNote?: string
        },
    ) {
        return this.guardSosService.resolveGuardSOS(
            user.id,
            id,
            dto,
        )
    }
}