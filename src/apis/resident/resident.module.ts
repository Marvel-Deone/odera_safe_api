import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PaystackService } from '../finance/paystack.service';
import { ResidentSelfOnboardingController } from './resident-self-onboarding.controller';
import { ResidentSelfOnboardingService } from './resident-self-onboarding.service';
import { ResidentWhatsappService } from './resident-whatsapp.service';
import { ClientService } from '../../shared/client/client.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FinanceModule } from '../finance/finance.module';
import { EmailService } from '../../shared/email.service';
import { IdentityModule } from '../identity/identity.module';
import { IdentityService } from '../identity/identity.service';

@Module({
    imports: [ConfigModule, PrismaModule, HttpModule, FinanceModule, IdentityModule,],
    providers: [
        ResidentService,
        ResidentSelfOnboardingService,
        ResidentWhatsappService,
        EmailService,
        PaystackService,
        ClientService,
        IdentityService,
    ],
    controllers: [ResidentController, ResidentSelfOnboardingController],
})
export class ResidentModule {}
