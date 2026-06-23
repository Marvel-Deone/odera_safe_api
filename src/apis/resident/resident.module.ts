import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaystackService } from '../finance/paystack.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [ResidentService, PaystackService],
  controllers: [ResidentController]
})
export class ResidentModule {}
