import { Module } from '@nestjs/common';
import { GuardSosService } from './guard-sos.service';
import { GuardSosController } from './guard-sos.controller';

@Module({
  providers: [GuardSosService],
  controllers: [GuardSosController]
})
export class GuardSosModule {}
