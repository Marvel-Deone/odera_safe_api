import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    EmergencyNotificationEvent,
    GuardSOSStatus,
    IncidentCategory,
    IncidentSeverity,
    IncidentStatus,
    IncidentTimelineEvent,
    Role,
    TicketPriority,
} from '@prisma/client';

import { PrismaService } from '../../database/prisma/prisma.service';
import {
    CreateAdminSosDto,
    CreateGuardSosDto,
    CreateResidentSosDto,
    SosActionDto,
    StartSosLiveStreamDto,
    UpdateSosLocationDto,
} from './dto';
import { SosChatService } from './sos-chat.service';
import { SosNotificationService } from './sos-notification.service';
import { SosPolicyService } from './sos-policy.service';
import { SosRecipientService } from './sos-recipient.service';
import { SosTimelineService } from './sos-timeline.service';
import { SosTransitionService } from './sos-transition.service';
import {
    SosAction,
    SosActor,
    SosRealtimePayload,
    SosRecipient,
    SosType,
} from './sos.types';

@Injectable()
export class SosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly policy: SosPolicyService,
        private readonly transitions: SosTransitionService,
        private readonly recipients: SosRecipientService,
        private readonly notifications: SosNotificationService,
        private readonly timeline: SosTimelineService,
        private readonly chat: SosChatService,
    ) {}

    async createGuardSos(userId: string, dto: CreateGuardSosDto) {
        const actor = await this.getActor(userId);
        this.policy.assertCanCreate(actor, SosType.GUARD);

        const guard = await this.prisma.guard.findUnique({
            where: { userId },
        });

        if (!guard) {
            throw new NotFoundException('Guard profile not found');
        }

        const recipients = await this.recipients.getRecipients(
            actor.estateId,
            SosType.GUARD,
        );

        const location = this.formatLocation(
            dto.zone ?? guard.zone_assignment,
            dto.latitude,
            dto.longitude,
        );

        const result = await this.prisma.$transaction(async (tx) => {
            const incident = await tx.incident.create({
                data: {
                    estateId: actor.estateId,
                    reportedByGuardId: guard.id,
                    title: `Guard SOS - ${actor.displayName}`,
                    category: IncidentCategory.EMERGENCY,
                    description:
                        dto.message ??
                        `${actor.displayName} triggered a Guard SOS`,
                    severity: IncidentSeverity.CRITICAL,
                    priority: TicketPriority.P1_CRITICAL,
                    status: IncidentStatus.OPEN,
                    location,
                },
            });

            const guardSos = await tx.guardSOS.create({
                data: {
                    guardId: guard.id,
                    estateId: actor.estateId,
                    incidentId: incident.id,
                    category: dto.category,
                    zone: dto.zone ?? guard.zone_assignment,
                    message: dto.message,
                    latitude: dto.latitude,
                    longitude: dto.longitude,
                },
            });

            const room = await this.chat.create(tx, {
                incidentId: incident.id,
                estateId: actor.estateId,
                title: incident.title,
                participantIds: recipients.map((recipient) => recipient.id),
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.SOS_TRIGGERED,
                actor,
                location,
                metadata: {
                    type: SosType.GUARD,
                    guardSosId: guardSos.id,
                    category: dto.category,
                },
            });

            if (
                dto.latitude !== undefined &&
                dto.longitude !== undefined
            ) {
                await this.timeline.append(tx, {
                    incidentId: incident.id,
                    event: IncidentTimelineEvent.GPS_ACTIVATED,
                    actor,
                    location,
                    metadata: {
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    },
                });
            }

            await this.notifications.persist(tx, {
                incidentId: incident.id,
                recipients,
                event: EmergencyNotificationEvent.SOS_TRIGGERED,
                metadata: {
                    type: SosType.GUARD,
                    roomId: room.id,
                },
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
                note: `${recipients.length} notifications created`,
                metadata: {
                    recipientIds: recipients.map((recipient) => recipient.id),
                },
            });

            return { incident, guardSos, room };
        });

        this.publishCreated({
            type: SosType.GUARD,
            actor,
            recipients,
            incident: result.incident,
            roomId: result.room.id,
            sosId: result.guardSos.id,
        });

        return result;
    }

    async createResidentSos(userId: string, dto: CreateResidentSosDto) {
        const actor = await this.getActor(userId);
        this.policy.assertCanCreate(actor, SosType.RESIDENT);

        const resident = await this.prisma.resolveResidentForUser(userId, {
            street: true,
        });

        if (!resident) {
            throw new NotFoundException('Resident profile not found');
        }

        const recipients = await this.recipients.getRecipients(
            actor.estateId,
            SosType.RESIDENT,
        );

        const houseNumber = dto.houseNumber ?? resident.house_no;
        const streetName =
            dto.streetName ?? resident.street?.name ?? resident.block;

        const locationLabel = [
            houseNumber ? `House ${houseNumber}` : null,
            streetName,
        ]
            .filter(Boolean)
            .join(', ');

        const location = this.formatLocation(
            locationLabel,
            dto.latitude,
            dto.longitude,
        );

        const result = await this.prisma.$transaction(async (tx) => {
            const incident = await tx.incident.create({
                data: {
                    estateId: actor.estateId,
                    reportedByResidentId: resident.id,
                    title: `Resident SOS - ${actor.displayName}`,
                    category: IncidentCategory.EMERGENCY,
                    description:
                        dto.message ??
                        `${actor.displayName} triggered a Resident SOS`,
                    severity: IncidentSeverity.CRITICAL,
                    priority: TicketPriority.P1_CRITICAL,
                    status: IncidentStatus.OPEN,
                    location,
                },
            });

            const room = await this.chat.create(tx, {
                incidentId: incident.id,
                estateId: actor.estateId,
                title: incident.title,
                participantIds: recipients.map((recipient) => recipient.id),
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.SOS_TRIGGERED,
                actor,
                location,
                metadata: {
                    type: SosType.RESIDENT,
                    houseNumber,
                    streetName,
                },
            });

            if (
                dto.latitude !== undefined &&
                dto.longitude !== undefined
            ) {
                await this.timeline.append(tx, {
                    incidentId: incident.id,
                    event: IncidentTimelineEvent.GPS_ACTIVATED,
                    actor,
                    location,
                    metadata: {
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    },
                });
            }

            await this.notifications.persist(tx, {
                incidentId: incident.id,
                recipients,
                event: EmergencyNotificationEvent.SOS_TRIGGERED,
                metadata: {
                    type: SosType.RESIDENT,
                    roomId: room.id,
                    playSound: false,
                },
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
                note: `${recipients.length} notifications created`,
                metadata: {
                    recipientIds: recipients.map((recipient) => recipient.id),
                },
            });

            return { incident, room };
        });

        this.publishCreated({
            type: SosType.RESIDENT,
            actor,
            recipients,
            incident: result.incident,
            roomId: result.room.id,
        });

        return result;
    }

    async createAdminSos(userId: string, dto: CreateAdminSosDto) {
        const actor = await this.getActor(userId);
        this.policy.assertCanCreate(actor, SosType.ADMIN);

        const recipients = await this.recipients.getRecipients(
            actor.estateId,
            SosType.ADMIN,
        );

        const locationLabel = [
            dto.zone,
            dto.houseNumber ? `House ${dto.houseNumber}` : null,
            dto.streetName,
        ]
            .filter(Boolean)
            .join(', ');

        const location = this.formatLocation(
            locationLabel,
            dto.latitude,
            dto.longitude,
        );

        const result = await this.prisma.$transaction(async (tx) => {
            const incident = await tx.incident.create({
                data: {
                    estateId: actor.estateId,
                    title: `Admin SOS - ${actor.displayName}`,
                    category: IncidentCategory.EMERGENCY,
                    description: dto.message,
                    severity: dto.severity,
                    priority:
                        dto.severity === IncidentSeverity.CRITICAL
                            ? TicketPriority.P1_CRITICAL
                            : TicketPriority.P2_URGENT,
                    status: dto.escalateImmediately
                        ? IncidentStatus.ESCALATED
                        : IncidentStatus.OPEN,
                    location,
                },
            });

            const room = await this.chat.create(tx, {
                incidentId: incident.id,
                estateId: actor.estateId,
                title: incident.title,
                participantIds: recipients.map((recipient) => recipient.id),
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.SOS_TRIGGERED,
                actor,
                location,
                metadata: {
                    type: SosType.ADMIN,
                    reporterId: actor.id,
                    reporterName: actor.displayName,
                    reporterRole: actor.role,
                    category: dto.category,
                    requiresEmergencyContact:
                        dto.requiresEmergencyContact ?? false,
                },
            });

            if (dto.escalateImmediately) {
                await this.timeline.append(tx, {
                    incidentId: incident.id,
                    event: IncidentTimelineEvent.ESCALATED,
                    actor,
                    note: 'Escalated immediately on creation',
                });
            }

            const notificationEvent = dto.escalateImmediately
                ? EmergencyNotificationEvent.ESCALATED
                : EmergencyNotificationEvent.SOS_TRIGGERED;

            await this.notifications.persist(tx, {
                incidentId: incident.id,
                recipients,
                event: notificationEvent,
                metadata: {
                    type: SosType.ADMIN,
                    roomId: room.id,
                },
            });

            await this.timeline.append(tx, {
                incidentId: incident.id,
                event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
                note: `${recipients.length} notifications created`,
                metadata: {
                    recipientIds: recipients.map((recipient) => recipient.id),
                    event: notificationEvent,
                },
            });

            return { incident, room };
        });

        this.publishCreated({
            type: SosType.ADMIN,
            actor,
            recipients,
            incident: result.incident,
            roomId: result.room.id,
        });

        return result;
    }

    async getVisible(userId: string) {
        const actor = await this.getActor(userId);

        const participantRooms =
            await this.prisma.incidentChatParticipant.findMany({
                where: { userId },
                select: {
                    room: {
                        select: { incidentId: true },
                    },
                },
            });

        const incidentIds = participantRooms
            .map((item) => item.room.incidentId)
            .filter((id): id is string => Boolean(id));

        return this.prisma.incident.findMany({
            where: {
                estateId: actor.estateId,
                category: IncidentCategory.EMERGENCY,
                id: { in: incidentIds },
            },
            include: {
                guardSos: true,
                reportedByGuard: true,
                reportedByResident: {
                    include: { street: true },
                },
                chatRoom: true,
                timeline: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getOne(userId: string, incidentId: string) {
        await this.chat.assertParticipant(userId, incidentId);

        const incident = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                category: IncidentCategory.EMERGENCY,
            },
            include: {
                guardSos: true,
                reportedByGuard: true,
                reportedByResident: {
                    include: { street: true },
                },
                chatRoom: true,
                timeline: {
                    include: { actor: true },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!incident) {
            throw new NotFoundException('SOS incident not found');
        }

        return incident;
    }

    async act(
        userId: string,
        incidentId: string,
        action: SosAction,
        dto: SosActionDto,
    ) {
        const actor = await this.getActor(userId);
        const incident = await this.requireIncident(incidentId);

        this.policy.assertSameEstate(actor, incident);
        this.policy.assertCanAct(actor, action);
        this.transitions.assertAllowed(incident.status, action);

        const type = this.inferType(incident);
        const recipientIds = await this.getParticipantIds(incidentId);

        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedIncident = await tx.incident.update({
                where: { id: incidentId },
                data: this.transitions.updateFor(
                    action,
                    actor.id,
                    dto.note,
                ),
                include: {
                    reportedByGuard: true,
                    reportedByResident: true,
                    guardSos: true,
                    chatRoom: true,
                },
            });

            await this.timeline.append(tx, {
                incidentId,
                event: this.timelineEvent(action),
                actor,
                note: dto.note,
                metadata: {
                    action,
                    previousStatus: incident.status,
                    nextStatus: updatedIncident.status,
                },
            });

            if (
                incident.guardSos &&
                action === SosAction.ACKNOWLEDGE
            ) {
                await tx.guardSOS.update({
                    where: { id: incident.guardSos.id },
                    data: {
                        status: GuardSOSStatus.ACKNOWLEDGED,
                        acknowledgedAt: new Date(),
                        acknowledgedBy: actor.id,
                    },
                });
            }

            if (
                incident.guardSos &&
                action === SosAction.RESOLVE
            ) {
                await tx.guardSOS.update({
                    where: { id: incident.guardSos.id },
                    data: {
                        status: GuardSOSStatus.RESOLVED,
                        resolvedAt: new Date(),
                        resolvedBy: actor.id,
                        resolutionNote: dto.note,
                    },
                });
            }

            if (this.isClosingAction(action)) {
                await this.chat.close(tx, incidentId);
            }

            return updatedIncident;
        });

        const reporter = await this.resolveReporter(
            updated,
            actor,
        );

        this.notifications.publish(
            this.actionEventName(action),
            {
                incidentId,
                type,
                status: updated.status,
                recipientIds,
                reporter,
                location: updated.location,
                notification: this.notifications.behavior(type),
                data: {
                    action,
                    note: dto.note,
                    actor: {
                        id: actor.id,
                        name: actor.displayName,
                        role: actor.role,
                    },
                    updatedAt: updated.updatedAt,
                },
            },
        );

        return updated;
    }

    async updateLocation(
        userId: string,
        incidentId: string,
        dto: UpdateSosLocationDto,
    ) {
        const actor = await this.getActor(userId);
        const incident = await this.requireIncident(incidentId);

        this.policy.assertSameEstate(actor, incident);
        await this.chat.assertParticipant(userId, incidentId);
        this.assertIncidentIsActive(incident.status);

        const type = this.inferType(incident);
        const recipientIds = await this.getParticipantIds(incidentId);

        const location = this.formatLocation(
            incident.guardSos?.zone ??
                this.extractLocationLabel(incident.location),
            dto.latitude,
            dto.longitude,
        );

        const updated = await this.prisma.$transaction(async (tx) => {
            const updatedIncident = await tx.incident.update({
                where: { id: incidentId },
                data: { location },
                include: {
                    reportedByGuard: true,
                    reportedByResident: true,
                    guardSos: true,
                    chatRoom: true,
                },
            });

            if (incident.guardSos) {
                await tx.guardSOS.update({
                    where: { id: incident.guardSos.id },
                    data: {
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    },
                });
            }

            const gpsAlreadyActivated =
                await tx.incidentTimelineEntry.findFirst({
                    where: {
                        incidentId,
                        event: IncidentTimelineEvent.GPS_ACTIVATED,
                    },
                    select: { id: true },
                });

            if (!gpsAlreadyActivated) {
                await this.timeline.append(tx, {
                    incidentId,
                    event: IncidentTimelineEvent.GPS_ACTIVATED,
                    actor,
                    location,
                    note: dto.note,
                    metadata: {
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    },
                });
            }

            return updatedIncident;
        });

        const reporter = await this.resolveReporter(
            updated,
            actor,
        );

        this.notifications.publish('sos.location.updated', {
            incidentId,
            type,
            status: updated.status,
            recipientIds,
            reporter,
            location,
            notification: this.notifications.behavior(type),
            data: {
                latitude: dto.latitude,
                longitude: dto.longitude,
                note: dto.note,
                updatedAt: updated.updatedAt,
            },
        });

        return updated;
    }

    async startLiveStream(
        userId: string,
        incidentId: string,
        dto: StartSosLiveStreamDto,
    ) {
        const actor = await this.getActor(userId);
        const incident = await this.requireIncident(incidentId);

        this.policy.assertSameEstate(actor, incident);
        await this.chat.assertParticipant(userId, incidentId);
        this.assertIncidentIsActive(incident.status);

        const type = this.inferType(incident);
        const recipientIds = await this.getParticipantIds(incidentId);

        await this.prisma.$transaction(async (tx) => {
            await this.timeline.append(tx, {
                incidentId,
                event: IncidentTimelineEvent.LIVE_STREAM_STARTED,
                actor,
                note: dto.note,
                metadata: {
                    streamUrl: dto.streamUrl,
                },
            });
        });

        const reporter = await this.resolveReporter(
            incident,
            actor,
        );

        this.notifications.publish('sos.live-stream.started', {
            incidentId,
            type,
            status: incident.status,
            recipientIds,
            reporter,
            location: incident.location,
            notification: this.notifications.behavior(type),
            data: {
                active: true,
                streamUrl: dto.streamUrl,
                note: dto.note,
            },
        });

        return {
            incidentId,
            active: true,
            streamUrl: dto.streamUrl,
        };
    }

    async getTimeline(userId: string, incidentId: string) {
        await this.chat.assertParticipant(userId, incidentId);
        return this.timeline.list(incidentId);
    }

    private async getActor(userId: string): Promise<SosActor> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                guard: true,
                resident: true,
                residentAssociate: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const residentName = user.resident
            ? `${user.resident.first_name} ${user.resident.last_name}`
            : undefined;

        return {
            id: user.id,
            estateId: user.estateId,
            role: user.role,
            displayName:
                user.guard?.full_name ??
                residentName ??
                user.residentAssociate?.fullName ??
                user.email,
        };
    }

    private async requireIncident(incidentId: string) {
        const incident = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                category: IncidentCategory.EMERGENCY,
            },
            include: {
                guardSos: true,
                reportedByGuard: {
                    select: {
                        id: true,
                        userId: true,
                        full_name: true,
                    },
                },
                reportedByResident: {
                    select: {
                        id: true,
                        userId: true,
                        first_name: true,
                        last_name: true,
                    },
                },
                chatRoom: {
                    select: {
                        id: true,
                        closedAt: true,
                    },
                },
            },
        });

        if (!incident) {
            throw new NotFoundException('SOS incident not found');
        }

        return incident;
    }

    private async getParticipantIds(
        incidentId: string,
    ): Promise<string[]> {
        const participants =
            await this.prisma.incidentChatParticipant.findMany({
                where: {
                    room: { incidentId },
                },
                select: { userId: true },
            });

        return participants.map((participant) => participant.userId);
    }

    private inferType(incident: {
        reportedByResidentId: string | null;
        reportedByGuardId: string | null;
    }): SosType {
        if (incident.reportedByResidentId) {
            return SosType.RESIDENT;
        }

        if (incident.reportedByGuardId) {
            return SosType.GUARD;
        }

        return SosType.ADMIN;
    }

    private timelineEvent(action: SosAction): IncidentTimelineEvent {
        const events: Record<SosAction, IncidentTimelineEvent> = {
            [SosAction.ACKNOWLEDGE]:
                IncidentTimelineEvent.ACKNOWLEDGED,
            [SosAction.ESCALATE]: IncidentTimelineEvent.ESCALATED,
            [SosAction.SILENCE]: IncidentTimelineEvent.SILENCED,
            [SosAction.RESOLVE]: IncidentTimelineEvent.RESOLVED,
            [SosAction.FALSE_ALARM]: IncidentTimelineEvent.FALSE_ALARM,
            [SosAction.CLOSE]: IncidentTimelineEvent.CLOSED,
        };

        return events[action];
    }

    private actionEventName(action: SosAction): string {
        const events: Record<SosAction, string> = {
            [SosAction.ACKNOWLEDGE]: 'sos.acknowledged',
            [SosAction.ESCALATE]: 'sos.escalated',
            [SosAction.SILENCE]: 'sos.silenced',
            [SosAction.RESOLVE]: 'sos.resolved',
            [SosAction.FALSE_ALARM]: 'sos.false-alarm',
            [SosAction.CLOSE]: 'sos.closed',
        };

        return events[action];
    }

    private isClosingAction(action: SosAction): boolean {
        return [
            SosAction.RESOLVE,
            SosAction.FALSE_ALARM,
            SosAction.CLOSE,
        ].includes(action);
    }

    private assertIncidentIsActive(status: IncidentStatus): void {
        const terminalStatuses: IncidentStatus[] = [
            IncidentStatus.RESOLVED,
            IncidentStatus.FALSE_ALARM,
            IncidentStatus.CLOSED,
        ];

        if (terminalStatuses.includes(status)) {
            throw new BadRequestException(
                `Incident is already ${status}`,
            );
        }
    }

    private async resolveReporter(
        incident: {
            id: string;
            reportedByGuard?: {
                userId: string;
                full_name: string;
            } | null;
            reportedByResident?: {
                userId: string | null;
                first_name: string;
                last_name: string;
            } | null;
        },
        fallbackActor: SosActor,
    ): Promise<SosRealtimePayload['reporter']> {
        if (incident.reportedByGuard) {
            return {
                id: incident.reportedByGuard.userId,
                name: incident.reportedByGuard.full_name,
                role: Role.GUARD,
            };
        }

        if (incident.reportedByResident?.userId) {
            return {
                id: incident.reportedByResident.userId,
                name: `${incident.reportedByResident.first_name} ${incident.reportedByResident.last_name}`,
                role: Role.RESIDENT,
            };
        }

        const trigger =
            await this.prisma.incidentTimelineEntry.findFirst({
                where: {
                    incidentId: incident.id,
                    event: IncidentTimelineEvent.SOS_TRIGGERED,
                },
                include: {
                    actor: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            guard: {
                                select: { full_name: true },
                            },
                            resident: {
                                select: {
                                    first_name: true,
                                    last_name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
            });

        if (trigger?.actor) {
            const actorName =
                trigger.actor.guard?.full_name ??
                (trigger.actor.resident
                    ? `${trigger.actor.resident.first_name} ${trigger.actor.resident.last_name}`
                    : trigger.actor.email);

            return {
                id: trigger.actor.id,
                name: actorName,
                role: trigger.actor.role,
            };
        }

        return {
            id: fallbackActor.id,
            name: fallbackActor.displayName,
            role: fallbackActor.role,
        };
    }

    private publishCreated(input: {
        type: SosType;
        actor: SosActor;
        recipients: SosRecipient[];
        incident: {
            id: string;
            status: IncidentStatus;
            location: string | null;
        };
        roomId: string;
        sosId?: string;
    }): void {
        this.notifications.publish('sos.created', {
            incidentId: input.incident.id,
            sosId: input.sosId,
            type: input.type,
            status: input.incident.status,
            roomId: input.roomId,
            recipientIds: input.recipients.map(
                (recipient) => recipient.id,
            ),
            reporter: {
                id: input.actor.id,
                name: input.actor.displayName,
                role: input.actor.role,
            },
            location: input.incident.location,
            notification: this.notifications.behavior(input.type),
            data: {
                incident: input.incident,
            },
        });
    }

    private formatLocation(
        label?: string | null,
        latitude?: number,
        longitude?: number,
    ): string | null {
        const cleanLabel = label?.trim() || null;
        const coordinates =
            latitude !== undefined && longitude !== undefined
                ? `${latitude}, ${longitude}`
                : null;

        return [cleanLabel, coordinates].filter(Boolean).join(' - ') || null;
    }

    private extractLocationLabel(
        location?: string | null,
    ): string | undefined {
        if (!location) {
            return undefined;
        }

        const parts = location.split(' - ');
        return parts[0]?.trim() || undefined;
    }
}
