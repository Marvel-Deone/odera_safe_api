import { Injectable, NotFoundException } from '@nestjs/common';
import { EmergencyContactActionType, IncidentTimelineEvent, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
    CallEmergencyContactDto,
    CreateEmergencyContactDto,
    SendEmergencyMessageDto,
    UpdateEmergencyContactDto,
} from './dto';
import { SosPolicyService } from './sos-policy.service';
import { SosTimelineService } from './sos-timeline.service';
import { SosActor } from './sos.types';

@Injectable()
export class EmergencyContactService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly policy: SosPolicyService,
        private readonly timeline: SosTimelineService,
    ) {}

    async list(userId: string) {
        const actor = await this.getActor(userId);
        this.policy.assertCanUseEmergencyContact(actor);
        return this.prisma.emergencyContact.findMany({
            where: { estateId: actor.estateId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async create(userId: string, dto: CreateEmergencyContactDto) {
        const actor = await this.getActor(userId);
        this.policy.assertCanManageEmergencyContacts(actor);
        return this.prisma.emergencyContact.create({ data: { estateId: actor.estateId, ...dto } });
    }

    async update(userId: string, contactId: string, dto: UpdateEmergencyContactDto) {
        const actor = await this.getActor(userId);
        this.policy.assertCanManageEmergencyContacts(actor);
        await this.requireContact(actor.estateId, contactId);
        return this.prisma.emergencyContact.update({ where: { id: contactId }, data: dto });
    }

    async recordCall(userId: string, contactId: string, dto: CallEmergencyContactDto) {
        return this.recordAction(userId, contactId, dto.incidentId, EmergencyContactActionType.CALL, dto.note);
    }

    async recordSms(userId: string, contactId: string, dto: SendEmergencyMessageDto) {
        return this.recordAction(
            userId,
            contactId,
            dto.incidentId,
            EmergencyContactActionType.SMS,
            dto.note,
            dto.message,
        );
    }

    private async recordAction(
        userId: string,
        contactId: string,
        incidentId: string,
        action: EmergencyContactActionType,
        note?: string,
        message?: string,
    ) {
        const actor = await this.getActor(userId);
        this.policy.assertCanUseEmergencyContact(actor);
        const contact = await this.requireContact(actor.estateId, contactId);
        const incident = await this.prisma.incident.findFirst({ where: { id: incidentId, estateId: actor.estateId } });
        if (!incident) throw new NotFoundException('SOS incident not found');

        return this.prisma.$transaction(async (tx) => {
            const result = await tx.emergencyContactAction.create({
                data: {
                    estateId: actor.estateId,
                    incidentId,
                    contactId,
                    actorId: actor.id,
                    action,
                    destination: action === EmergencyContactActionType.SMS ? contact.smsPhone ?? contact.phone : contact.phone,
                    note,
                    metadata: message ? { message } : undefined,
                },
            });

            // Add EMERGENCY_CONTACT_CALLED and EMERGENCY_MESSAGE_SENT to IncidentTimelineEvent.
            const event = (action === EmergencyContactActionType.CALL
                ? 'EMERGENCY_CONTACT_CALLED'
                : 'EMERGENCY_MESSAGE_SENT') as IncidentTimelineEvent;

            await this.timeline.append(tx, {
                incidentId,
                event,
                actor,
                note,
                metadata: { contactId, contactType: contact.type, action, message },
            });
            return result;
        });
    }

    private requireContact(estateId: string, contactId: string) {
        return this.prisma.emergencyContact.findFirst({ where: { id: contactId, estateId } }).then((contact) => {
            if (!contact) throw new NotFoundException('Emergency contact not found');
            return contact;
        });
    }

    private async getActor(userId: string): Promise<SosActor> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        return { id: user.id, estateId: user.estateId, role: user.role, displayName: user.email };
    }
}
