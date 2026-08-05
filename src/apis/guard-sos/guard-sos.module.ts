import { Module } from '@nestjs/common';
import { GuardSosService } from './guard-sos.service';
import { GuardSosController } from './guard-sos.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { IncidentGateway } from '../incident/incident.gateway';

@Module({
    imports: [PrismaModule],
    providers: [GuardSosService, IncidentGateway],
    controllers: [GuardSosController],
})
export class GuardSosModule {}
