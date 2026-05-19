import { Module } from '@nestjs/common';
import { GuardSosService } from './guard-sos.service';
import { GuardSosController } from './guard-sos.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GuardSosService],
  controllers: [GuardSosController]
})
export class GuardSosModule {}
