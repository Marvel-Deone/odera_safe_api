import { Module } from '@nestjs/common'

import { GuardController, PublicGuardController } from './guard.controller'

import { GuardService } from './guard.service'

import { PrismaService } from '../../database/prisma/prisma.service'
import { PatrolMonitoringService } from '../patrol-monitoring/patrol-monitoring.service'
import { EmailService } from '../../shared/email.service'
import { IdentityService } from '../identity/identity.service'

@Module({
  controllers: [GuardController, PublicGuardController],

  providers: [
    GuardService,
    PrismaService,
    PatrolMonitoringService,
    EmailService,
    IdentityService,
  ],
})
export class GuardModule {}