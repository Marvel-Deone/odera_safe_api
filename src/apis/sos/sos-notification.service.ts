import { Injectable } from '@nestjs/common';
import { EmergencyNotificationEvent, Prisma } from '@prisma/client';
import { SosGateway } from './realtime/sos.gateway';
import { SosRealtimePayload, SosRecipient, SosType } from './sos.types';

@Injectable()
export class SosNotificationService {
    constructor(private readonly gateway: SosGateway) { }

    behavior(type: SosType) {
        return {
            showModal: true,
            playSound: type !== SosType.RESIDENT,
            vibrate: true,
        };
    }

    persist(
        tx: Prisma.TransactionClient,
        input: {
            incidentId: string;
            recipients: SosRecipient[];
            event: EmergencyNotificationEvent;
            metadata?: Prisma.InputJsonValue;
        },
    ) {
        return tx.emergencyNotification.createMany({
            data: input.recipients.map((recipient) => ({
                incidentId: input.incidentId,
                recipientId: recipient.id,
                event: input.event,
                metadata: input.metadata,
            })),
            skipDuplicates: true,
        });
    }

    publish(event: string, payload: SosRealtimePayload): void {
        this.gateway.emitToUsers(payload.recipientIds, event, payload);
    }

    getBehavior(type: SosType) {
        switch (type) {
            case SosType.RESIDENT:
                return {
                    showModal: true,
                    playSound: false,
                    vibrate: true,
                };

            case SosType.GUARD:
                return {
                    showModal: true,
                    playSound: true,
                    vibrate: true,
                };

            case SosType.ADMIN:
                return {
                    showModal: true,
                    playSound: true,
                    vibrate: true,
                };
        }
    }

    publishToUsers(
        recipientIds: string[],
        event: string,
        payload: Record<string, unknown>,
    ) {
        this.gateway.emitToUsers(
            recipientIds,
            event,
            payload,
        );
    }
}
