import { IncidentStatus, Role } from '@prisma/client';

export enum SosType {
    GUARD = 'GUARD',
    RESIDENT = 'RESIDENT',
    ADMIN = 'ADMIN',
}

export enum SosAction {
    ACKNOWLEDGE = 'ACKNOWLEDGE',
    ESCALATE = 'ESCALATE',
    SILENCE = 'SILENCE',
    RESOLVE = 'RESOLVE',
    FALSE_ALARM = 'FALSE_ALARM',
    CLOSE = 'CLOSE',
}

export interface SosActor {
    id: string;
    estateId: string;
    role: Role;
    displayName: string;
}

export interface SosRecipient {
    id: string;
    role: Role;
    email: string;
}

export interface SosRealtimePayload {
    incidentId: string;
    sosId?: string;
    type: SosType;
    status: IncidentStatus;
    roomId?: string;
    recipientIds: string[];
    reporter: {
        id: string;
        name: string;
        role: Role;
    };
    location?: string | null;
    notification: {
        showModal: boolean;
        playSound: boolean;
        vibrate: boolean;
    };
    data?: Record<string, unknown>;
}
