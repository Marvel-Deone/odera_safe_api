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
  ApiTags,
} from '@nestjs/swagger'

import { GuardRole, Role } from '@prisma/client'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'

import { Roles } from '../auth/decorators/roles.decorator'

import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { GuardService } from './guard.service'

@ApiTags('Guards')
@ApiBearerAuth()

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)

@Controller()
export class GuardController {
  constructor(
    private readonly guardsService: GuardService,
  ) { }

  @Post('admin/guards')
  @Roles(Role.ADMIN)

  @HttpCode(HttpStatus.OK)

  @ApiOperation({
    summary: 'Create guard',
  })
  async createGuard(
    @CurrentUser() user: any,

    @Body()
    dto: any,
  ) {
    return this.guardsService.createGuard(
      user.id,
      dto,
    )
  }

  @Get('admin/guards')
  @Roles(Role.ADMIN)

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
  @Roles(Role.ADMIN)

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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)

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
  )

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

  @Patch(
    'admin/guards/:guardId',
  )
  @Roles(Role.ADMIN)

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

  // @Patch(
  //   'admin/guards/:guardId/activate',
  // )
  // @Roles(Role.ADMIN)

  // @HttpCode(HttpStatus.OK)

  // @ApiOperation({
  //   summary: 'Activate guard',
  // })
  // async activateGuard(
  //   @CurrentUser() user: any,

  //   @Param('guardId')
  //   guardId: string,

  //   @Body()
  //   dto: any,
  // ) {
  //   return this.guardsService.updateGuard(
  //     user.id,
  //     guardId,
  //     dto,
  //   )
  // }

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

  @Get('guards/attendance')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Attendance Logs' })
  getAttendance(@CurrentUser() user: any) {
    return this.guardsService.getAttendance(
      user.id,
    )
  }

  @Post('guards/assign-shift')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
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
}