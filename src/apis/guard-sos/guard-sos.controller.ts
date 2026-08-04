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
} from '@nestjs/common';
import { GuardSosService } from './guard-sos.service';
import {
    CloseGuardSOSDto,
    CreateEmergencyContactDto,
    CreateGuardSOSDto,
    EmergencyContactActionDto,
    EscalateGuardSOSDto,
    ResolveGuardSOSDto,
    TriggerGuardSOSAlarmDto,
    UpdateEmergencyContactDto,
} from './dto/guard-sos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Guards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('guard-sos')
export class GuardSosController {
    constructor(private readonly guardSosService: GuardSosService) {}

    @Post()
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Create guard sos alert',
    })
    createGuardSOS(@CurrentUser() user: any, @Body() dto: CreateGuardSOSDto) {
        return this.guardSosService.createGuardSOS(user.id, dto);
    }

    @Get()
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get guard SOS alerts',
    })
    getGuardSOSAlerts(@CurrentUser() user: any) {
        return this.guardSosService.getGuardSOSAlerts(user.id);
    }

    @Patch(':id/cancel')
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Cancel own SOS alert',
    })
    cancelGuardSOS(@CurrentUser() user: any, @Param('id') id: string) {
        return this.guardSosService.cancelGuardSOS(user.id, id);
    }

    @Patch(':id/live-stream-started')
    @Roles(Role.GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Record live stream started for SOS alert',
    })
    markLiveStreamStarted(@CurrentUser() user: any, @Param('id') id: string) {
        return this.guardSosService.markLiveStreamStarted(user.id, id);
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
    getAllGuardSOSAlerts(@CurrentUser() user: any) {
        return this.guardSosService.getAllGuardSOSAlerts(user.id);
    }

    @Get('admin/alerts/:id')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get SOS alert by ID',
    })
    getGuardSOSById(@CurrentUser() user: any, @Param('id') id: string) {
        return this.guardSosService.getGuardSOSById(user.id, id);
    }

    @Patch(':id/acknowledge')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Acknowledge SOS alert by ID',
    })
    acknowledgeGuardSOS(@CurrentUser() user: any, @Param('id') id: string) {
        return this.guardSosService.acknowledgeGuardSOS(user.id, id);
    }

    @Patch(':id/escalate')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Escalate SOS alert by ID',
    })
    escalateGuardSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: EscalateGuardSOSDto,
    ) {
        return this.guardSosService.escalateGuardSOS(user.id, id, dto);
    }

    @Patch(':id/alarm')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Trigger SOS alarm broadcast',
    })
    triggerAlarm(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: TriggerGuardSOSAlarmDto,
    ) {
        return this.guardSosService.triggerAlarm(user.id, id, dto);
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
        dto: ResolveGuardSOSDto,
    ) {
        return this.guardSosService.resolveGuardSOS(user.id, id, dto);
    }

    @Patch(':id/close')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Close SOS incident and make incident chat read-only',
    })
    closeGuardSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: CloseGuardSOSDto,
    ) {
        return this.guardSosService.closeGuardSOS(user.id, id, dto);
    }

    @Get('admin/emergency-contacts')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get configured emergency contacts',
    })
    listEmergencyContacts(@CurrentUser() user: any) {
        return this.guardSosService.listEmergencyContacts(user.id);
    }

    @Post('admin/emergency-contacts')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Configure emergency contact',
    })
    createEmergencyContact(
        @CurrentUser() user: any,
        @Body() dto: CreateEmergencyContactDto,
    ) {
        return this.guardSosService.createEmergencyContact(user.id, dto);
    }

    @Patch('admin/emergency-contacts/:contactId')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update emergency contact',
    })
    updateEmergencyContact(
        @CurrentUser() user: any,
        @Param('contactId') contactId: string,
        @Body() dto: UpdateEmergencyContactDto,
    ) {
        return this.guardSosService.updateEmergencyContact(
            user.id,
            contactId,
            dto,
        );
    }

    @Post('admin/emergency-contacts/:contactId/call')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Record call action to emergency contact',
    })
    recordCallAction(
        @CurrentUser() user: any,
        @Param('contactId') contactId: string,
        @Body() dto: EmergencyContactActionDto,
    ) {
        return this.guardSosService.recordCallAction(user.id, contactId, dto);
    }

    @Post('admin/emergency-contacts/:contactId/sms')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Record SMS action to emergency contact',
    })
    recordSmsAction(
        @CurrentUser() user: any,
        @Param('contactId') contactId: string,
        @Body() dto: EmergencyContactActionDto,
    ) {
        return this.guardSosService.recordSmsAction(user.id, contactId, dto);
    }

    @Post('admin/emergency-contacts/:contactId/super-admin-escalation')
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Record Super Admin escalation action',
    })
    recordSuperAdminEscalation(
        @CurrentUser() user: any,
        @Param('contactId') contactId: string,
        @Body() dto: EmergencyContactActionDto,
    ) {
        return this.guardSosService.recordSuperAdminEscalation(
            user.id,
            contactId,
            dto,
        );
    }
}
