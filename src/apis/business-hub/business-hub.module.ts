import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import {
  AdminBusinessHubController,
  BusinessHubController,
  GuardBusinessHubController,
} from './business-hub.controller'
import { BusinessHubService } from './business-hub.service'

@Module({
  imports: [PrismaModule],
  controllers: [BusinessHubController, AdminBusinessHubController, GuardBusinessHubController],
  providers: [BusinessHubService],
})
export class BusinessHubModule {}
