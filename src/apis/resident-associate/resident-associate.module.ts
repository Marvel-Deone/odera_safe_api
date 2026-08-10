import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { FinanceModule } from '../finance/finance.module';
import { ResidentAssociateController } from './resident-associate.controller';
import { ResidentAssociateService } from './resident-associate.service';
import { EmailService } from '../../shared/email.service';

@Module({
    imports: [ConfigModule, PrismaModule, HttpModule, FinanceModule],
    controllers: [ResidentAssociateController],
    providers: [ResidentAssociateService, EmailService],
})
export class ResidentAssociateModule {}
