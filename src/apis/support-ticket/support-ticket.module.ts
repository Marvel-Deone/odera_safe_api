import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { SupportTicketController } from './support-ticket.controller';
import { SupportTicketService } from './support-ticket.service';

@Module({
    imports: [PrismaModule],
    providers: [SupportTicketService],
    controllers: [SupportTicketController],
})
export class SupportTicketModule {}
