import { Module } from '@nestjs/common';
import { GuardLocationService } from './guard-location.service';
import { GuardLocationController } from './guard-location.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { GuardLocationGateway } from './guard-location.gateway';

@Module({
  imports: [PrismaModule],
  providers: [GuardLocationService, GuardLocationGateway],
  controllers: [GuardLocationController]
})
export class GuardLocationModule {}
