import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import {
    AcknowledgeSosDto,
    CallEmergencyContactDto,
    CloseSosDto,
    CreateAdminSosDto,
    CreateEmergencyContactDto,
    CreateGuardSosDto,
    CreateResidentSosDto,
    EscalateSosDto,
    MarkSosFalseAlarmDto,
    ResolveSosDto,
    SendEmergencyMessageDto,
    SilenceSosDto,
    StartSosLiveStreamDto,
    UpdateEmergencyContactDto,
    UpdateSosLocationDto,
} from './dto';

import { SosService } from './sos.service';
import { EmergencyContactService } from './emergency-contact.service';
import { SosAction } from './sos.types';

interface AuthenticatedUser {
    id: string;
    estateId: string;
    role: Role;
}

@ApiTags('SOS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sos')
export class SosController {
    constructor(
        private readonly sosService: SosService,
        private readonly emergencyContactService: EmergencyContactService,
    ) {}

    /*
     * Emergency contacts
     */

    @Get('emergency-contacts')
    @Roles(Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Get configured emergency contacts',
    })
    listEmergencyContacts(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.emergencyContactService.list(user.id);
    }

    @Post('emergency-contacts')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create an emergency contact',
    })
    createEmergencyContact(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateEmergencyContactDto,
    ) {
        return this.emergencyContactService.create(
            user.id,
            dto,
        );
    }

    @Patch('emergency-contacts/:contactId')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Update an emergency contact',
    })
    updateEmergencyContact(
        @CurrentUser() user: AuthenticatedUser,
        @Param('contactId', ParseUUIDPipe)
        contactId: string,
        @Body() dto: UpdateEmergencyContactDto,
    ) {
        return this.emergencyContactService.update(
            user.id,
            contactId,
            dto,
        );
    }

    @Post('emergency-contacts/:contactId/call')
    @Roles(Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Record a call to an emergency contact',
    })
    callEmergencyContact(
        @CurrentUser() user: AuthenticatedUser,
        @Param('contactId', ParseUUIDPipe)
        contactId: string,
        @Body() dto: CallEmergencyContactDto,
    ) {
        return this.emergencyContactService.recordCall(
            user.id,
            contactId,
            dto,
        );
    }

    @Post('emergency-contacts/:contactId/sms')
    @Roles(Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Record an SMS sent to an emergency contact',
    })
    sendEmergencyMessage(
        @CurrentUser() user: AuthenticatedUser,
        @Param('contactId', ParseUUIDPipe)
        contactId: string,
        @Body() dto: SendEmergencyMessageDto,
    ) {
        return this.emergencyContactService.recordSms(
            user.id,
            contactId,
            dto,
        );
    }

    /*
     * SOS creation
     */

    @Post('guard')
    @Roles(Role.GUARD, Role.SUPER_GUARD)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a Guard SOS',
    })
    createGuardSos(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateGuardSosDto,
    ) {
        return this.sosService.createGuardSos(
            user.id,
            dto,
        );
    }

    @Post('resident')
    @Roles(Role.RESIDENT)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a Resident SOS',
    })
    createResidentSos(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateResidentSosDto,
    ) {
        return this.sosService.createResidentSos(
            user.id,
            dto,
        );
    }

    @Post('admin')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create an Admin SOS',
    })
    createAdminSos(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: CreateAdminSosDto,
    ) {
        return this.sosService.createAdminSos(
            user.id,
            dto,
        );
    }

    /*
     * Queries
     */

    @Get()
    @ApiOperation({
        summary: 'Get SOS incidents visible to the current user',
    })
    getVisibleSos(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.sosService.getVisible(user.id);
    }

    @Get(':incidentId/timeline')
    @ApiOperation({
        summary: 'Get an SOS incident timeline',
    })
    getTimeline(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
    ) {
        return this.sosService.getTimeline(
            user.id,
            incidentId,
        );
    }

    @Get(':incidentId')
    @ApiOperation({
        summary: 'Get an SOS incident',
    })
    getOne(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
    ) {
        return this.sosService.getOne(
            user.id,
            incidentId,
        );
    }

    /*
     * Lifecycle actions
     */

    @Patch(':incidentId/acknowledge')
    @Roles(
        Role.GUARD,
        Role.SUPER_GUARD,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    acknowledge(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: AcknowledgeSosDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.ACKNOWLEDGE,
            dto,
        );
    }

    @Patch(':incidentId/escalate')
    @Roles(
        Role.SUPER_GUARD,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    escalate(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: EscalateSosDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.ESCALATE,
            dto,
        );
    }

    @Patch(':incidentId/silence')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    silence(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: SilenceSosDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.SILENCE,
            dto,
        );
    }

    @Patch(':incidentId/resolve')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    resolve(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: ResolveSosDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.RESOLVE,
            dto,
        );
    }

    @Patch(':incidentId/false-alarm')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    markFalseAlarm(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: MarkSosFalseAlarmDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.FALSE_ALARM,
            dto,
        );
    }

    @Patch(':incidentId/close')
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    close(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: CloseSosDto,
    ) {
        return this.sosService.act(
            user.id,
            incidentId,
            SosAction.CLOSE,
            dto,
        );
    }

    /*
     * Live data
     */

    @Patch(':incidentId/location')
    @Roles(
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    updateLocation(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: UpdateSosLocationDto,
    ) {
        return this.sosService.updateLocation(
            user.id,
            incidentId,
            dto,
        );
    }

    @Patch(':incidentId/live-stream')
    @Roles(
        Role.RESIDENT,
        Role.GUARD,
        Role.SUPER_GUARD,
        Role.ADMIN,
        Role.SUPER_ADMIN,
    )
    startLiveStream(
        @CurrentUser() user: AuthenticatedUser,
        @Param('incidentId', ParseUUIDPipe)
        incidentId: string,
        @Body() dto: StartSosLiveStreamDto,
    ) {
        return this.sosService.startLiveStream(
            user.id,
            incidentId,
            dto,
        );
    }
}