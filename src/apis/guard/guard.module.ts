import { Module } from '@nestjs/common'

import { GuardController } from './guard.controller'

import { GuardService } from './guard.service'

import { PrismaService } from '../../database/prisma/prisma.service'
import { PatrolMonitoringService } from '../patrol-monitoring/patrol-monitoring.service'

@Module({
  controllers: [GuardController],

  providers: [
    GuardService,
    PrismaService,
    PatrolMonitoringService,
  ],
})
export class GuardModule {}