import { Module } from '@nestjs/common'

import { GuardController, PublicGuardController } from './guard.controller'

import { GuardService } from './guard.service'

import { PrismaService } from '../../database/prisma/prisma.service'
import { PatrolMonitoringService } from '../patrol-monitoring/patrol-monitoring.service'
import { EmailService } from '../../shared/email.service'
import { IdentityService } from '../identity/identity.service'
import { ClientService } from '../../shared/client/client.service'
import { HttpModule, HttpService } from '@nestjs/axios'
import { StorageModule } from '../../storage/storage.module'

@Module({
  imports: [HttpModule, StorageModule],
  controllers: [GuardController, PublicGuardController],

  providers: [
    ClientService,
    GuardService,
    PrismaService,
    PatrolMonitoringService,
    EmailService,
    IdentityService,
  ],
})
export class GuardModule {}