import { Module } from '@nestjs/common';
import { ShiftSwapService } from './shift-swap.service';
import { ShiftSwapController } from './shift-swap.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShiftSwapService],
  controllers: [ShiftSwapController]
})
export class ShiftSwapModule {}
