import { Controller, Get, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getDashboard() {
    return this.dashboardService.getAdminDashboard()
  }
}