import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { FinanceModule } from '../finance/finance.module';
import { ResidentAssociateController } from './resident-associate.controller';
import { ResidentAssociateService } from './resident-associate.service';
import { EmailService } from '../../shared/email.service';
import { ResidentAssociateAdminController } from './resident-associate-admin.controller';
import { ResidentAssociateAdminService } from './resident-associate-admin.service';
import { ResidentAssociateCredentialsService } from './resident-associate-credentials.service';

@Module({
    imports: [ConfigModule, PrismaModule, HttpModule, FinanceModule],
    controllers: [
        ResidentAssociateController,
        ResidentAssociateAdminController,
    ],
    providers: [
        ResidentAssociateService,
        EmailService,
        ResidentAssociateAdminService,
        ResidentAssociateCredentialsService,
    ],
})
export class ResidentAssociateModule { }
