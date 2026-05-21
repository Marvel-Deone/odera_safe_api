import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PerformanceService } from './performance.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
  ) {}

  // Generate snapshots for a date range
  @Post('generate')
  async generate(
    @Req() req,
    @Body()
    body: {
      periodStart: string
      periodEnd: string
    },
  ) {
    return this.performanceService.generateForAdmin(
      req.user.id,
      new Date(body.periodStart),
      new Date(body.periodEnd),
    )
  }

  // Estate rankings
  @Get('rankings')
  async getRankings(@Req() req) {
    return this.performanceService.getEstateRankings(
      req.user.id,
    )
  }

  // Guard-specific analytics (admin)
  @Get('guard/:guardId')
  async getGuardPerformance(
    @Req() req,
    @Param('guardId') guardId: string,
  ) {
    return this.performanceService.getGuardPerformance(
      req.user.id,
      guardId,
    )
  }

  // Logged-in guard performance
  @Get('me')
  async getMyPerformance(@Req() req) {
    return this.performanceService.getMyPerformance(
      req.user.id,
    )
  }
}