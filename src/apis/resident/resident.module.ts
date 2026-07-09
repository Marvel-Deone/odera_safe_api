import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaystackService } from '../finance/paystack.service';
import { ResidentSelfOnboardingController } from './resident-self-onboarding.controller';
import { ResidentSelfOnboardingService } from './resident-self-onboarding.service';
import { ResidentWhatsappService } from './resident-whatsapp.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    ResidentService,
    ResidentSelfOnboardingService,
    ResidentWhatsappService,
    PaystackService,
  ],
  controllers: [ResidentController, ResidentSelfOnboardingController]
})
export class ResidentModule {}
