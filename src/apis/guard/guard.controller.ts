import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { GuardRole, Role } from '@prisma/client'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { GuardService } from './guard.service'
import { CreateGuardDto } from './dto/guard.dto'
import { NinVerificationDto } from '../identity/dto/verify-nin.dto'

@ApiTags('Guards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class GuardController {
  constructor(
    private readonly guardsService: GuardService,
  ) { }

  @Post('admin/guards')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create guard',
  })
  async createGuard(
    @CurrentUser() user: any,

    @Body()
    dto: CreateGuardDto,
  ) {
    return this.guardsService.createGuard(
      user.id,
      dto,
    )
  }

  @Get('admin/guards')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.GUARD)
  @ApiOperation({
    summary: 'Get guards',
  })
  async getGuards(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getGuards(
      user.id,
    )
  }

  @Get('admin/guards/:guardId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get guard by ID',
  })
  async getGuardById(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.getGuardById(
      user.id,
      guardId,
    )
  }

  @Patch(
    'admin/guards/:guardId/suspend',
  )
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Suspend guard',
  })
  async suspendGuard(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.suspendGuard(
      user.id,
      guardId,
    )
  }

  @Patch(
    'admin/guards/:guardId/activate',
  )
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate guard',
  })
  async activateGuard(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,
  ) {
    return this.guardsService.activateGuard(
      user.id,
      guardId,
    )
  }

  @Get('guards/dashboard')
  @Roles(
    Role.GUARD,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )

   @Post('guards/verify-nin')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
      summary: 'Verify NIN with NIN no',
      description: "Verifies user's NIN through QoreID",
    })
    @ApiResponse({
      status: 200,
      description: 'NIN verification successful',
    })
    async verifyNinOnly(
      @CurrentUser() user: any,
      @Body() ninData: NinVerificationDto,
    ) {
      return await this.guardsService.verifyNinOnly(user, ninData);
    }

  @ApiOperation({
    summary: 'Guard dashboard',
  })
  async getDashboard(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getDashboard(
      user.id,
    )
  }

  @Get('guards/upcoming-resumptions')
  getUpcomingResumptions(@Req() req: any) {
    return this.guardsService.getUpcomingResumptions(
      req.user.id,
    )
  }

  @Get('guards/my-roster')
  @Roles(Role.GUARD)

  @ApiOperation({
    summary: 'My Roster',
  })

  getMyRoster(@Req() req: any) {
    return this.guardsService.getMyRoster(req.user.id)
  }

  @Patch(
    'admin/guards/:guardId',
  )
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Update guard',
  })
  async updateGuard(
    @CurrentUser() user: any,

    @Param('guardId')
    guardId: string,

    @Body()
    dto: any,
  ) {
    return this.guardsService.updateGuard(
      user.id,
      guardId,
      dto,
    )
  }

  @Patch(':id/promote')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Promote guard',
  })
  promoteGuard(
    @Req() req,
    @Param('id') guardId: string,
    @Body() dto: { role?: GuardRole },
  ) {
    return this.guardsService.promoteGuard(
      req.user.id,
      guardId,
      dto,
    )
  }

  @Get('guards/activity-feed')
  @Roles(
    Role.GUARD,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )

  @ApiOperation({
    summary: 'Activity feed',
  })
  async getActivityFeed(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getActivityFeed(
      user.id,
    )
  }

  @Get('guards/gate-queue')
  @Roles(
    Role.GUARD,
    Role.ADMIN,
    Role.SUPER_ADMIN,
  )

  @ApiOperation({
    summary: 'Gate queue',
  })
  async getGateQueue(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getGateQueue(
      user.id,
    )
  }

  @Post('admin/schedule/generate')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Generate weekly schedule',
  })
  generateSchedule(@Req() req) {
    return this.guardsService.generateWeeklySchedule(
      req.user.id,
    )
  }

  @Get('admin/schedule')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)

  @ApiOperation({
    summary: 'Get weekly schedule',
  })
  getSchedule(@Req() req) {
    return this.guardsService.getWeeklySchedule(
      req.user.id,
    )
  }

  @Post('guards/clock-in')
  @Roles(Role.GUARD)
  @ApiOperation({ summary: 'Clock In' })
  clockIn(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.guardsService.clockIn(
      user.id,
      dto,
    )
  }

  @Post('guards/clock-out')
  @Roles(Role.GUARD)
  @ApiOperation({ summary: 'Clock Out' })
  clockOut(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.guardsService.clockOut(
      user.id,
      dto,
    )
  }

  @Get('admin/attendance')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Attendance Logs' })
  getAttendance(@CurrentUser() user: any) {
    return this.guardsService.getAttendance(
      user.id,
    )
  }

  @Get('admin/on-duty-guards')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'On Duty Guards' })
  getOnDutyGuards(@CurrentUser() user: any) {
    return this.guardsService.getOnDutyGuards(
      user.id,
    )
  }

  @Post('guards/assign-shift')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUPER_GUARD)
  @ApiOperation({ summary: 'Assign Shift' })
  assignShift(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.guardsService.assignShift(
      user.id,
      dto,
    )
  }

  // @Post('guards/incidents')
  // @Roles(Role.GUARD)
  // createIncident(
  //   @CurrentUser() user: any,
  //   @Body() dto: CreateIncidentDto,
  // ) {
  //   return this.guardsService.createIncident(
  //     user.id,
  //     dto,
  //   )
  // }

  // @Get('guards/incidents')
  // @Roles(Role.GUARD)
  // getMyIncidents(
  //   @CurrentUser() user: any,
  // ) {
  //   return this.guardsService.getMyIncidents(
  //     user.id,
  //   )
  // }

  // @Get('admin/incidents')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // getAllIncidents(
  //   @CurrentUser() user: any,
  // ) {
  //   return this.guardsService.getAllIncidents(
  //     user.id,
  //   )
  // }

  // @Get('admin/incidents/:id')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // getIncidentById(
  //   @CurrentUser() user: any,
  //   @Param('id') id: string,
  // ) {
  //   return this.guardsService.getIncidentById(
  //     user.id,
  //     id,
  //   )
  // }

  // @Patch('admin/incidents/:id')
  // @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  // updateIncidentStatus(
  //   @CurrentUser() user: any,
  //   @Param('id') id: string,
  //   @Body()
  //   dto: {
  //     status: IncidentStatus
  //     adminNotes?: string
  //   },
  // ) {
  //   return this.guardsService.updateIncidentStatus(
  //     user.id,
  //     id,
  //     dto,
  //   )
  // }
  @Post('admin/patrol-checkpoints')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create patrol checkpoint' })
  createPatrolCheckpoint(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.guardsService.createPatrolCheckpoint(
      user.id,
      dto,
    )
  }

  @Get('admin/patrol-checkpoints')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get patrol checkpoints' })
  getPatrolCheckpoints(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getPatrolCheckpoints(
      user.id,
    )
  }

  @Get('admin/patrol-checkpoints/:id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get patrol checkpoint details' })
  getPatrolCheckpointById(
    @CurrentUser() user: any,
    @Param('id') checkpointId: string,
  ) {
    return this.guardsService.getPatrolCheckpointById(
      user.id,
      checkpointId,
    )
  }

  @Post('guards/patrol-scans')
  @Roles(Role.GUARD, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Scan patrol checkpoint' })
  scanPatrolCheckpoint(
    @CurrentUser() user: any,
    @Body() dto: any,
  ) {
    return this.guardsService.scanPatrolCheckpoint(
      user.id,
      dto,
    )
  }

  @Get('guards/patrol-log')
  @Roles(Role.GUARD)
  @ApiOperation({ summary: 'Get guard patrol log' })
  getMyPatrolLog(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getMyPatrolLog(
      user.id,
    )
  }

  @Get('admin/patrol-scans')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all patrol scans' })
  getPatrolScans(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getPatrolScans(
      user.id,
    )
  }

  @Get('admin/patrol-alerts')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get patrol alerts' })
  getPatrolAlerts(
    @CurrentUser() user: any,
  ) {
    return this.guardsService.getPatrolAlerts(
      user.id,
    )
  }

  @Get('admin/dashboard/security-overview')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get security overview' })
  getSecurityOverview(
    @Req() req,
  ) {
    return this.guardsService.getSecurityOverview(
      req.user.id,
    )
  }

  @Get('guards/patrol-dashboard')
  @Roles(Role.GUARD)
  getGuardPatrolDashboard(
    @Req() req,
  ) {
    return this.guardsService.getGuardPatrolDashboard(
      req.user.id,
    )
  }
}

@ApiTags('Public Guards')
@Controller('guards')
export class PublicGuardController {
  constructor(private readonly guardsService: GuardService,) { }

  @Post('self-onboarding')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create guard',
  })
  async guardselfonboarding(
    @CurrentUser() user: any,

    @Body()
    dto: CreateGuardDto,
  ) {
    return this.guardsService.guardSelfOnboarding(dto)
  }
}