import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { TrackingService } from '../tracking/tracking.service';

@Module({
  imports: [PrismaModule],
  providers: [VisitorService, TrackingService],
  controllers: [VisitorController]
})
export class VisitorModule {}
