import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { FinanceModule } from '../finance/finance.module';
import { ResidentEmailService } from '../resident/resident-email.service';
import { ResidentAssociateController } from './resident-associate.controller';
import { ResidentAssociateService } from './resident-associate.service';

@Module({
    imports: [ConfigModule, PrismaModule, HttpModule, FinanceModule],
    controllers: [ResidentAssociateController],
    providers: [ResidentAssociateService, ResidentEmailService],
})
export class ResidentAssociateModule {}
