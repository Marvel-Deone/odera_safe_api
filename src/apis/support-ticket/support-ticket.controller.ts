import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipLevyCheck } from '../auth/decorators/skip-levy-check.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
    CancelSupportTicketDto,
    CreateSupportTicketDto,
    ResolveSupportTicketDto,
} from './dto/support-ticket.dto';
import { SupportTicketService } from './support-ticket.service';

@ApiTags('Support Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@SkipLevyCheck()
@Controller('support-tickets')
export class SupportTicketController {
    constructor(
        private readonly supportTicketService: SupportTicketService,
    ) {}

    @Post()
    @Roles(Role.RESIDENT, Role.GUARD, Role.ADMIN)
    @ApiOperation({
        summary: 'Create a support ticket',
        description:
            'Creates an application support ticket. This route is not restricted by resident KYC or levy status.',
    })
    create(
        @CurrentUser() user: any,
        @Body() dto: CreateSupportTicketDto,
    ) {
        return this.supportTicketService.create(user.id, dto);
    }

    @Get('mine')
    @Roles(Role.RESIDENT, Role.GUARD, Role.ADMIN)
    @ApiOperation({
        summary: 'Get my support tickets',
    })
    getMine(@CurrentUser() user: any) {
        return this.supportTicketService.getMine(user.id);
    }

    @Get('mine/:id')
    @Roles(Role.RESIDENT, Role.GUARD, Role.ADMIN)
    @ApiOperation({
        summary: 'Get one of my support tickets',
    })
    getMineById(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.supportTicketService.getMineById(user.id, id);
    }

    @Get('admin')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Get all support tickets',
    })
    getAll(@CurrentUser() user: any) {
        return this.supportTicketService.getAll(user.id);
    }

    @Get('admin/:id')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Get support ticket details and history',
    })
    getById(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.supportTicketService.getById(user.id, id);
    }

    @Patch('admin/:id/resolve')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Resolve a support ticket',
    })
    resolve(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: ResolveSupportTicketDto,
    ) {
        return this.supportTicketService.resolve(user.id, id, dto);
    }

    @Patch('admin/:id/cancel')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Cancel a support ticket',
    })
    cancel(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: CancelSupportTicketDto,
    ) {
        return this.supportTicketService.cancel(user.id, id, dto);
    }
}
