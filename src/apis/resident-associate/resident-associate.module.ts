import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { ResidentEmailService } from '../resident/resident-email.service';
import { ResidentAssociateController } from './resident-associate.controller';
import { ResidentAssociateService } from './resident-associate.service';

@Module({
    imports: [ConfigModule, PrismaModule, HttpModule],
    controllers: [ResidentAssociateController],
    providers: [ResidentAssociateService, ResidentEmailService],
})
export class ResidentAssociateModule {}
