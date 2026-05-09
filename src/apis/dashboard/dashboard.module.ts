import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { PrismaModule } from '../../database/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
  providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule { }