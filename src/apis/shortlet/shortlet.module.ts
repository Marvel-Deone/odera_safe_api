import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import {
  AdminShortletController,
  GuardShortletController,
  ShortletController,
} from './shortlet.controller'
import { ShortletScheduler } from './shortlet.scheduler'
import { ShortletSmsService } from './shortlet-sms.service'
import { ShortletService } from './shortlet.service'

@Module({
  imports: [PrismaModule],
  controllers: [ShortletController, AdminShortletController, GuardShortletController],
  providers: [ShortletService, ShortletSmsService, ShortletScheduler],
})
export class ShortletModule {}
