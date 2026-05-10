import { Module } from '@nestjs/common'

import { GuardController } from './guard.controller'

import { GuardService } from './guard.service'

import { PrismaService } from '../../database/prisma/prisma.service'

@Module({
  controllers: [GuardController],

  providers: [
    GuardService,
    PrismaService,
  ],
})
export class GuardModule {}