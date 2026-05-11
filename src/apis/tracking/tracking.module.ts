import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { TrackingCleanupService } from './tracking.cleanup';

@Module({
  imports: [PrismaModule],
  providers: [
    TrackingService,
    TrackingCleanupService,
  ],
  controllers: [TrackingController]
})
export class TrackingModule { }
