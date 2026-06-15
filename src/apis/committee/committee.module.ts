import { Module } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CommitteeController } from './committee.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommitteeService],
  controllers: [CommitteeController]
})
export class CommitteeModule {}
