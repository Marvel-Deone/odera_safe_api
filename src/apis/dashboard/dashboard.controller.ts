import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard data' })
  getDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('super-admin')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get super admin dashboard data' })
  getSuperAdminDashboard() {
    return this.dashboardService.getSuperAdminDashboard();
  }
}
