import { Module } from '@nestjs/common';
import { SosService } from './sos.service';
import { SosController } from './sos.controller';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { SosTimelineService } from './sos-timeline.service';
import { SosChatService } from './sos-chat.service';
import { SosNotificationService } from './sos-notification.service';
import { SosPolicyService } from './sos-policy.service';
import { SosRecipientService } from './sos-recipient.service';
import { SosTransitionService } from './sos-transition.service';
import { SosGateway } from './realtime/sos.gateway';
import { EmergencyContactService } from './emergency-contact.service';

@Module({
  imports: [PrismaModule],
  providers: [
    SosService, 
    SosTimelineService, 
    SosChatService, 
    SosNotificationService, 
    SosPolicyService, 
    SosRecipientService, 
    SosTimelineService, 
    SosTransitionService,
    SosGateway,
    EmergencyContactService
  ],
  controllers: [SosController]
})
export class SosModule {}
