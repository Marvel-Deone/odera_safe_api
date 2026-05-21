import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PerformanceService } from './performance.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { GuardRole, Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@ApiTags('Guards')
@ApiBearerAuth()

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
  ) { }

  // Generate snapshots for a date range
  @Post('generate')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate guard performance snapshots for a specified date range',
  })
  async generate(
    @CurrentUser() user: any,
    @Body()
    body: {
      periodStart: string
      periodEnd: string
    },
  ) {
    return this.performanceService.generateForAdmin(
      user.id,
      new Date(body.periodStart),
      new Date(body.periodEnd),
    )
  }

  // Estate rankings
  @Get('rankings')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
  @ApiOperation({
    summary: 'Get rankings of estates based on guard performance',
  })
  async getRankings(@CurrentUser() user: any) {
    return this.performanceService.getEstateRankings(
      user.id,
    )
  }

  // Guard-specific analytics (admin)
  @Get('guard/:guardId')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, GuardRole.SUPER_GUARD as unknown as Role)
  @ApiOperation({
    summary: 'Get performance metrics for a specific guard',
  })
  async getGuardPerformance(
    @CurrentUser() user: any,
    @Param('guardId') guardId: string,
  ) {
    return this.performanceService.getGuardPerformance(
      user.id,
      guardId,
    )
  }

  // Logged-in guard performance
  @Get('me')
  @Roles(Role.GUARD)
  @ApiOperation({
    summary: 'Get performance metrics for the logged-in guard',
  })
  async getMyPerformance(@CurrentUser() user: any) {
    return this.performanceService.getMyPerformance(
      user.id,
    )
  }
}