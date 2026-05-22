import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common'

import { GuardLocationService } from './guard-location.service'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { CreateGuardLocationDto } from './dto/guard-location.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { GuardRole, Role } from '@prisma/client'


@ApiTags('Guard Locations')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Controller('guard-locations')
export class GuardLocationController {
    constructor(
        private readonly guardLocationService: GuardLocationService,
    ) { }

    @Post()
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Update guard location (for guards) or get guard location (for admins)',
    })
    async createLocation(
        @CurrentUser() user: any,

        @Body()
        dto: CreateGuardLocationDto,
    ) {
        console.log('controllerUser:', user);

        return this.guardLocationService.createLocation(
            user.id,
            dto,
        )
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
    @ApiOperation({
        summary: 'Get live locations of guards in the estate',
    })
    @Get('live')
    async getLiveLocations(
        @CurrentUser() user: any,
    ) {
        console.log('controllerUser:', user);
        return this.guardLocationService.getLiveLocations(
            user.id,
        )
    }
}