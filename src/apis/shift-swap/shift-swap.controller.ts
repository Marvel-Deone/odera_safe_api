import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { ShiftSwapService } from './shift-swap.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateShiftSwapDto, RejectShiftSwapDto } from './dto/shift-swap.dto'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
// import { AuthenticatedRequest } from '../../common/types/authenticated-request.type'

@ApiTags('Shift Swaps')
@ApiBearerAuth()

@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Controller('shift-swaps')
export class ShiftSwapController {
    constructor(
        private readonly shiftSwapService: ShiftSwapService,
    ) { }

    // Guard creates swap request
    @Post()
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Create shift swap request',
    })
    createSwapRequest(
        @CurrentUser() user: any,
        @Body() dto: CreateShiftSwapDto,
    ) {
        return this.shiftSwapService.createSwapRequest(
            user.id,
            dto,
        )
    }

    @Get()
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GUARD)
    @ApiOperation({
        summary: 'Get shift swap requests',
    })
    getSwapRequests(
        @CurrentUser() user: any,
    ) {
        return this.shiftSwapService.getSwapRequests(
            user.id,
        )
    }

    // Guard/Admin view requests
    @Get('admin')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GUARD)
    @ApiOperation({
        summary: 'Get all shift swap requests',
    })
    getAllSwapRequests(
        @CurrentUser() user: any,
    ) {
        return this.shiftSwapService.getAllSwapRequests(
            user.id,
        )
    }

    // Admin approves
    @Patch(':id/approve')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Approve shift swap request',
    })
    approveSwap(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.shiftSwapService.approveSwap(
            user.id,
            id,
        )
    }

    // Admin rejects
    @Patch(':id/reject')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Reject shift swap request',
    })
    rejectSwap(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: RejectShiftSwapDto,
    ) {
        return this.shiftSwapService.rejectSwap(
            user.id,
            id,
            dto,
        )
    }

    // Guard cancels own request
    @Patch(':id/cancel')
    @Roles(Role.GUARD)
    cancelSwapRequest(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.shiftSwapService.cancelSwapRequest(
            user.id,
            id,
        )
    }
}