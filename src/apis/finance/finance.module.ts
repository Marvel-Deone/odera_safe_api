import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from '../../database/prisma/prisma.module'
import { FinanceController } from './finance.controller'
import { FinanceService } from './finance.service'
import { PaystackService } from './paystack.service'

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [FinanceController],
  providers: [FinanceService, PaystackService],
})
export class FinanceModule {}
