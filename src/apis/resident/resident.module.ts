import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaystackService } from '../finance/paystack.service';
import { ResidentSelfOnboardingController } from './resident-self-onboarding.controller';
import { ResidentSelfOnboardingService } from './resident-self-onboarding.service';
import { ResidentWhatsappService } from './resident-whatsapp.service';
import { ResidentEmailService } from './resident-email.service';
import { ClientService } from '../../shared/client/client.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, PrismaModule, HttpModule],
  providers: [
    ResidentService,
    ResidentSelfOnboardingService,
    ResidentWhatsappService,
    ResidentEmailService,
    PaystackService,
    ClientService,
  ],
  controllers: [ResidentController, ResidentSelfOnboardingController]
})
export class ResidentModule {}
