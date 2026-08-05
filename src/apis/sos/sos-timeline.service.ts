import { Injectable } from '@nestjs/common';
import { IncidentTimelineEvent, Prisma } from '@prisma/client';
import { SosActor } from './sos.types';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class SosTimelineService {
    append(
        tx: Prisma.TransactionClient,
        input: {
            incidentId: string;
            event: IncidentTimelineEvent;
            actor?: SosActor;
            note?: string;
            location?: string | null;
            metadata?: Prisma.InputJsonValue;
        },
    ) {
        return tx.incidentTimelineEntry.create({
            data: {
                incidentId: input.incidentId,
                event: input.event,
                actorId: input.actor?.id,
                actorRole: input.actor?.role,
                note: input.note,
                location: input.location ?? undefined,
                metadata: input.metadata,
            },
        });
    }

    list(incidentId: string) {
        return this.prisma.incidentTimelineEntry.findMany({
            where: { incidentId },
            include: { actor: { select: { id: true, email: true, role: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }

    constructor(private readonly prisma: PrismaService) {}
}
