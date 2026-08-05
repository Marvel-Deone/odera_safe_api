import { BadRequestException, Injectable } from '@nestjs/common';
import { IncidentStatus, Prisma } from '@prisma/client';
import { SosAction } from './sos.types';

@Injectable()
export class SosTransitionService {
    assertAllowed(current: IncidentStatus, action: SosAction): void {
        const terminal: IncidentStatus[] = [IncidentStatus.RESOLVED, IncidentStatus.FALSE_ALARM, IncidentStatus.CLOSED];

        if (current === IncidentStatus.CLOSED) {
            throw new BadRequestException('Closed SOS incidents cannot be changed');
        }

        if (action === SosAction.CLOSE && !terminal.includes(current)) {
            throw new BadRequestException('Resolve or mark the SOS as false alarm before closing');
        }

        if ([SosAction.ACKNOWLEDGE, SosAction.ESCALATE, SosAction.SILENCE].includes(action) && terminal.includes(current)) {
            throw new BadRequestException(`Cannot ${action.toLowerCase()} a completed SOS`);
        }
    }

    updateFor(action: SosAction, actorId: string, note?: string): Prisma.IncidentUpdateInput {
        const now = new Date();

        switch (action) {
            case SosAction.ACKNOWLEDGE:
                return { status: IncidentStatus.UNDER_REVIEW, adminNotes: note };
            case SosAction.ESCALATE:
                return { status: IncidentStatus.ESCALATED, adminNotes: note };
            case SosAction.SILENCE:
                return { silencedAt: now, silencedBy: actorId, adminNotes: note };
            case SosAction.RESOLVE:
                return { status: IncidentStatus.RESOLVED, completedAt: now, completionNote: note };
            case SosAction.FALSE_ALARM:
                return { status: IncidentStatus.FALSE_ALARM, completedAt: now, completionNote: note };
            case SosAction.CLOSE:
                return { status: IncidentStatus.CLOSED, adminNotes: note };
        }
    }
}
