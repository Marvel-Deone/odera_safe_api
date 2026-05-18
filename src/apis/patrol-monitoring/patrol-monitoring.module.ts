import { Module } from '@nestjs/common';
import { PatrolMonitoringService } from './patrol-monitoring.service';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PatrolMonitoringService]
})
export class PatrolMonitoringModule {}
