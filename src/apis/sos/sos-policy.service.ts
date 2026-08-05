import { ForbiddenException, Injectable } from '@nestjs/common';
import { Incident, Role } from '@prisma/client';
import { SosAction, SosActor, SosType } from './sos.types';

@Injectable()
export class SosPolicyService {
    private readonly createRoles: Record<SosType, Role[]> = {
        [SosType.GUARD]: [Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
        [SosType.RESIDENT]: [Role.RESIDENT],
        [SosType.ADMIN]: [Role.ADMIN, Role.SUPER_ADMIN],
    };

    assertCanCreate(actor: SosActor, type: SosType): void {
        if (!this.createRoles[type].includes(actor.role)) {
            throw new ForbiddenException(`You cannot create a ${type} SOS`);
        }
    }

    assertSameEstate(actor: SosActor, incident: Pick<Incident, 'estateId'>): void {
        if (actor.estateId !== incident.estateId) {
            throw new ForbiddenException('SOS belongs to another estate');
        }
    }

    assertCanAct(actor: SosActor, action: SosAction): void {
        const roles: Record<SosAction, Role[]> = {
            [SosAction.ACKNOWLEDGE]: [Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
            [SosAction.ESCALATE]: [Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
            [SosAction.SILENCE]: [Role.ADMIN, Role.SUPER_ADMIN],
            [SosAction.RESOLVE]: [Role.ADMIN, Role.SUPER_ADMIN],
            [SosAction.FALSE_ALARM]: [Role.ADMIN, Role.SUPER_ADMIN],
            [SosAction.CLOSE]: [Role.ADMIN, Role.SUPER_ADMIN],
        };

        if (!roles[action].includes(actor.role)) {
            throw new ForbiddenException(`You cannot ${action.toLowerCase()} this SOS`);
        }
    }

    assertCanManageEmergencyContacts(actor: SosActor): void {
        const allowed: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
        if (!allowed.includes(actor.role)) {
            throw new ForbiddenException('You cannot manage emergency contacts');
        }
    }

    assertCanUseEmergencyContact(actor: SosActor): void {
        const allowed: Role[] = [Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN];
        if (!allowed.includes(actor.role)) {
            throw new ForbiddenException('You cannot contact emergency services');
        }
    }
}
