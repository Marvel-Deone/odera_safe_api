import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { IncidentGateway } from './incident.gateway';

@Module({
  imports: [PrismaModule],
  providers: [IncidentService, IncidentGateway],
  controllers: [IncidentController]
})
export class IncidentModule {}
