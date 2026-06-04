import { Module } from '@nestjs/common';
// import { MaintenanceTicketService } from './maintenance-ticket.service';
// import { MaintenanceTicketController } from './maintenance-ticket.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { MaintenanceGateway } from './maintenance.gateway';

@Module({
  imports: [PrismaModule],
  // providers: [MaintenanceTicketService, MaintenanceGateway],
  // controllers: [MaintenanceTicketController]
})
export class MaintenanceTicketModule {}
