import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { IncidentService } from './incident.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { IncidentStatus, Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
    CreateIncidentDto,
    AssignIncidentDto,
    CompleteIncidentDto,
    RateIncidentDto,
    CreateResidentSOSDto,
    ResolveAllResidentSOSDto,
    SilenceResidentSOSDto,
} from './dto/incident.dto';

@ApiTags('Incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidents')
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) {}

    @Post()
    @Roles(Role.GUARD, Role.RESIDENT, Role.SUPER_GUARD)
    createIncident(@CurrentUser() user: any, @Body() dto: CreateIncidentDto) {
        return this.incidentService.createIncident(user.id, dto);
    }

    @Post('resident-sos')
    @Roles(Role.RESIDENT)
    @ApiOperation({
        summary: 'Trigger resident SOS',
    })
    createResidentSOS(
        @CurrentUser() user: any,
        @Body() dto: CreateResidentSOSDto,
    ) {
        return this.incidentService.createResidentSOS(user.id, dto);
    }

    @Patch('resident-sos/resolve-all')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Resolve all active resident SOS alerts',
    })
    resolveAllResidentSOS(
        @CurrentUser() user: any,
        @Body() dto: ResolveAllResidentSOSDto,
    ) {
        return this.incidentService.resolveAllResidentSOS(user.id, dto);
    }

    @Patch('resident-sos/:id/silence')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Silence resident SOS vibration',
    })
    silenceResidentSOS(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: SilenceResidentSOSDto,
    ) {
        return this.incidentService.silenceResidentSOS(user.id, id, dto);
    }

    @Get('/guards')
    @Roles(Role.GUARD)
    getMyIncidents(@CurrentUser() user: any) {
        return this.incidentService.getMyIncidents(user.id);
    }

    @Get('/admin')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    getAllIncidents(@CurrentUser() user: any) {
        return this.incidentService.getAllIncidents(user.id);
    }

    @Roles(Role.RESIDENT)
    @ApiOperation({
        summary: 'Get resident tickets',
    })
    @Get('resident')
    getResidentIncidents(@CurrentUser() user: any) {
        return this.incidentService.getResidentIncidents(user.id);
    }

    @Get('/admin/incidents/:id')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    getIncidentById(@CurrentUser() user: any, @Param('id') id: string) {
        return this.incidentService.getIncidentById(user.id, id);
    }

    @Patch('admin/incidents/:id')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    updateIncidentStatus(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body()
        dto: {
            status: IncidentStatus;
            adminNotes?: string;
        },
    ) {
        return this.incidentService.updateIncidentStatus(user.id, id, dto);
    }

    @Roles(Role.GUARD, Role.SUPER_GUARD)
    @ApiOperation({
        summary: 'Get techicians queeue',
    })
    @Get('guard/techqueue')
    getTechicianQueue(@CurrentUser() user: any) {
        return this.incidentService.getTechQueue(user.id);
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPER_GUARD)
    @ApiOperation({
        summary: 'Assign ticket to technician/guard',
    })
    @Patch(':id/assign')
    assignTicket(
        @Param('id') id: string,

        @Body()
        dto: AssignIncidentDto,
    ) {
        return this.incidentService.assignIncident(id, dto);
    }

    @Roles(Role.GUARD, Role.SUPER_GUARD)
    @ApiOperation({
        summary: 'Start job (technician/guard)',
    })
    @Patch(':id/start')
    startTicket(@Param('id') id: string) {
        return this.incidentService.startIncident(id);
    }

    @Roles(Role.GUARD, Role.SUPER_GUARD)
    @ApiOperation({
        summary: 'Complete job (technician/guard)',
    })
    @Patch(':id/complete')
    completeTicket(
        @Param('id') id: string,

        @Body()
        dto: CompleteIncidentDto,
    ) {
        return this.incidentService.completeIncident(id, dto);
    }

    @Roles(Role.RESIDENT)
    @ApiOperation({
        summary: 'Resident rate job/ticket',
    })
    @Patch(':id/rate')
    RateTicket(
        @Param('id') id: string,

        @Body()
        dto: RateIncidentDto,
    ) {
        return this.incidentService.rateIncident(id, dto);
    }
}
