import { HttpStatus, Injectable } from '@nestjs/common';
import {
    ChatRoomType,
    EmergencyContactActionType,
    EmergencyNotificationEvent,
    GuardSOSStatus,
    IncidentCategory,
    IncidentSeverity,
    IncidentStatus,
    IncidentTimelineEvent,
    LogCategory,
    Prisma,
    Role,
    TicketPriority,
} from '@prisma/client';
import { error, success } from '../../common/utils/response.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { IncidentGateway } from '../incident/incident.gateway';
import {
    CloseGuardSOSDto,
    CreateEmergencyContactDto,
    CreateGuardSOSDto,
    EmergencyContactActionDto,
    EscalateGuardSOSDto,
    ResolveGuardSOSDto,
    TriggerGuardSOSAlarmDto,
    UpdateEmergencyContactDto,
} from './dto/guard-sos.dto';

@Injectable()
export class GuardSosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly incidentGateway: IncidentGateway,
    ) {}

    private readonly adminRoles: Role[] = [
        Role.ADMIN,
        Role.SUPER_GUARD,
        Role.SUPER_ADMIN,
    ];

    private formatLocation(input: {
        zone?: string | null;
        latitude?: number | null;
        longitude?: number | null;
    }) {
        const coordinates =
            input.latitude !== null &&
            input.latitude !== undefined &&
            input.longitude !== null &&
            input.longitude !== undefined
                ? `${input.latitude}, ${input.longitude}`
                : null;

        return [input.zone, coordinates].filter(Boolean).join(' - ') || null;
    }

    private async getAdmin(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        });

        if (!admin) {
            error('Unauthorized', 'Admin not found', HttpStatus.NOT_FOUND);
        }

        return admin!;
    }

    private async getGuard(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        });

        if (!guard) {
            error('Not Found', 'Guard not found', HttpStatus.NOT_FOUND);
        }

        return guard!;
    }

    private async createActivityLog(input: {
        estateId: string;
        action: string;
        description: string;
        actorId?: string | null;
        actorRole?: Role | null;
        metadata?: Prisma.InputJsonValue;
    }) {
        return this.prisma.activityLog.create({
            data: {
                estateId: input.estateId,
                category: LogCategory.SECURITY,
                action: input.action,
                description: input.description,
                actorId: input.actorId ?? undefined,
                actorRole: input.actorRole ?? undefined,
                metadata: input.metadata,
            },
        });
    }

    private async appendTimeline(input: {
        incidentId: string;
        event: IncidentTimelineEvent;
        actorId?: string | null;
        actorRole?: Role | null;
        note?: string | null;
        location?: string | null;
        metadata?: Prisma.InputJsonValue;
    }) {
        return this.prisma.incidentTimelineEntry.create({
            data: {
                incidentId: input.incidentId,
                event: input.event,
                actorId: input.actorId ?? undefined,
                actorRole: input.actorRole ?? undefined,
                note: input.note ?? undefined,
                location: input.location ?? undefined,
                metadata: input.metadata,
            },
        });
    }

    private async getIncidentParticipants(input: {
        estateId: string;
        reporterUserId?: string | null;
        source: 'GUARD' | 'RESIDENT';
    }) {
        const roleFilter =
            input.source === 'GUARD'
                ? [Role.ADMIN, Role.SUPER_GUARD, Role.SUPER_ADMIN]
                : [Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN];

        const users = await this.prisma.user.findMany({
            where: {
                estateId: input.estateId,
                OR: [
                    { role: { in: roleFilter } },
                    ...(input.reporterUserId
                        ? [{ id: input.reporterUserId }]
                        : []),
                ],
            },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });

        return users;
    }

    private async getNotificationRecipients(estateId: string) {
        return this.prisma.user.findMany({
            where: {
                estateId,
                role: { in: this.adminRoles },
            },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });
    }

    private async notifyRecipients(input: {
        incidentId: string;
        estateId: string;
        event: EmergencyNotificationEvent;
        payload: Record<string, any>;
    }) {
        const recipients = await this.getNotificationRecipients(input.estateId);

        await this.prisma.emergencyNotification.createMany({
            data: recipients.map((recipient) => ({
                incidentId: input.incidentId,
                recipientId: recipient.id,
                event: input.event,
                metadata: input.payload,
            })),
            skipDuplicates: true,
        });

        await this.appendTimeline({
            incidentId: input.incidentId,
            event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
            note: `${recipients.length} emergency notifications sent`,
            metadata: {
                event: input.event,
                recipientIds: recipients.map((recipient) => recipient.id),
            },
        });

        return recipients;
    }

    private async createIncidentChat(input: {
        incidentId: string;
        estateId: string;
        title: string;
        participantIds: string[];
    }) {
        const room = await this.prisma.chatRoom.upsert({
            where: { incidentId: input.incidentId },
            update: {},
            create: {
                estateId: input.estateId,
                incidentId: input.incidentId,
                type: ChatRoomType.INCIDENT,
                name: input.title,
            },
        });

        await this.prisma.incidentChatParticipant.createMany({
            data: [...new Set(input.participantIds)].map((userId) => ({
                roomId: room.id,
                userId,
            })),
            skipDuplicates: true,
        });

        this.incidentGateway.emitIncidentChatOpened({
            incidentId: input.incidentId,
            roomId: room.id,
            participantIds: input.participantIds,
        });

        return room;
    }

    private async closeIncidentChat(incidentId: string) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { incidentId },
        });

        if (!room || room.closedAt) {
            return room;
        }

        const closed = await this.prisma.chatRoom.update({
            where: { id: room.id },
            data: { closedAt: new Date() },
        });

        this.incidentGateway.emitIncidentChatClosed({
            incidentId,
            roomId: closed.id,
            closedAt: closed.closedAt,
        });

        return closed;
    }

    private async findSosForAdmin(userId: string, sosId: string) {
        const admin = await this.getAdmin(userId);
        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                estateId: admin.estateId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        zone_assignment: true,
                        userId: true,
                    },
                },
                incident: {
                    include: {
                        timeline: { orderBy: { createdAt: 'asc' } },
                        chatRoom: true,
                    },
                },
            },
        });

        if (!sos) {
            error('Not Found', 'SOS alert not found', HttpStatus.NOT_FOUND);
        }

        return { admin, sos: sos! };
    }

    async createGuardSOS(userId: string, dto: CreateGuardSOSDto) {
        const guard = await this.getGuard(userId);

        const activeAlert = await this.prisma.guardSOS.findFirst({
            where: {
                guardId: guard.id,
                status: {
                    in: [GuardSOSStatus.ACTIVE, GuardSOSStatus.ACKNOWLEDGED],
                },
            },
        });

        if (activeAlert) {
            return error(
                'Conflict',
                'You already have an active SOS alert',
                HttpStatus.CONFLICT,
            );
        }

        const location = this.formatLocation({
            zone: dto.zone || guard.zone_assignment,
            latitude: dto.latitude,
            longitude: dto.longitude,
        });

        const { sos, incident, room } = await this.prisma.$transaction(
            async (tx) => {
                const incident = await tx.incident.create({
                    data: {
                        estateId: guard.estateId,
                        reportedByGuardId: guard.id,
                        title: `Guard SOS - ${guard.full_name}`,
                        category: IncidentCategory.EMERGENCY,
                        description:
                            dto.message ||
                            `${guard.full_name} triggered a guard SOS alert`,
                        severity: IncidentSeverity.CRITICAL,
                        priority: TicketPriority.P1_CRITICAL,
                        location,
                        status: IncidentStatus.OPEN,
                    },
                });

                const sos = await tx.guardSOS.create({
                    data: {
                        guardId: guard.id,
                        estateId: guard.estateId,
                        incidentId: incident.id,
                        category: dto.category,
                        zone: dto.zone || guard.zone_assignment,
                        message: dto.message,
                        latitude: dto.latitude,
                        longitude: dto.longitude,
                    },
                    include: {
                        guard: {
                            select: {
                                id: true,
                                full_name: true,
                                zone_assignment: true,
                                userId: true,
                            },
                        },
                    },
                });

                await tx.incidentTimelineEntry.create({
                    data: {
                        incidentId: incident.id,
                        event: IncidentTimelineEvent.SOS_TRIGGERED,
                        actorId: userId,
                        actorRole: Role.GUARD,
                        location,
                        metadata: {
                            sosId: sos.id,
                            category: sos.category,
                        },
                    },
                });

                if (dto.latitude !== undefined && dto.longitude !== undefined) {
                    await tx.incidentTimelineEntry.create({
                        data: {
                            incidentId: incident.id,
                            event: IncidentTimelineEvent.GPS_ACTIVATED,
                            actorId: userId,
                            actorRole: Role.GUARD,
                            location,
                            metadata: {
                                latitude: dto.latitude,
                                longitude: dto.longitude,
                            },
                        },
                    });
                }

                const room = await tx.chatRoom.create({
                    data: {
                        estateId: guard.estateId,
                        incidentId: incident.id,
                        type: ChatRoomType.INCIDENT,
                        name: `Incident Chat - ${incident.title}`,
                    },
                });

                return { sos, incident, room };
            },
        );

        const participants = await this.getIncidentParticipants({
            estateId: guard.estateId,
            reporterUserId: userId,
            source: 'GUARD',
        });

        await this.prisma.incidentChatParticipant.createMany({
            data: participants.map((participant) => ({
                roomId: room.id,
                userId: participant.id,
            })),
            skipDuplicates: true,
        });

        const payload = {
            sos,
            incident,
            roomId: room.id,
            location,
            source: 'GUARD_SOS',
        };

        const recipients = await this.notifyRecipients({
            incidentId: incident.id,
            estateId: guard.estateId,
            event: EmergencyNotificationEvent.SOS_TRIGGERED,
            payload,
        });

        await this.createActivityLog({
            estateId: guard.estateId,
            action: 'GUARD_SOS_TRIGGERED',
            description: `${guard.full_name} triggered an SOS alert`,
            actorId: userId,
            actorRole: Role.GUARD,
            metadata: {
                sosId: sos.id,
                incidentId: incident.id,
                roomId: room.id,
                recipientIds: recipients.map((recipient) => recipient.id),
            },
        });

        this.incidentGateway.emitEmergencyAlert(payload);
        this.incidentGateway.emitEmergencyAlarm({
            ...payload,
            alarmType: 'GUARD_SOS',
            recipientRoles: this.adminRoles,
        });
        this.incidentGateway.emitIncidentChatOpened({
            incidentId: incident.id,
            roomId: room.id,
            participantIds: participants.map((participant) => participant.id),
        });

        return success(
            {
                ...sos,
                incident,
                chatRoom: room,
                recipients,
            },
            'SOS Triggered',
            'Emergency alert sent successfully',
        );
    }

    async getAllGuardSOSAlerts(userId: string) {
        const admin = await this.getAdmin(userId);

        const alerts = await this.prisma.guardSOS.findMany({
            where: {
                estateId: admin.estateId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        zone_assignment: true,
                    },
                },
                incident: {
                    include: {
                        timeline: { orderBy: { createdAt: 'asc' } },
                        chatRoom: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return success(alerts, 'SOS Alerts', 'SOS alerts fetched successfully');
    }

    async getGuardSOSAlerts(userId: string) {
        const guard = await this.getGuard(userId);

        const alerts = await this.prisma.guardSOS.findMany({
            where: {
                guardId: guard.id,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        phone: true,
                        zone_assignment: true,
                    },
                },
                incident: {
                    include: {
                        timeline: { orderBy: { createdAt: 'asc' } },
                        chatRoom: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return success(alerts, 'SOS Alerts', 'SOS alerts fetched successfully');
    }

    async getGuardSOSById(userId: string, sosId: string) {
        const { sos } = await this.findSosForAdmin(userId, sosId);

        return success(sos, 'SOS Alert', 'SOS alert fetched successfully');
    }

    async acknowledgeGuardSOS(userId: string, sosId: string) {
        const { admin, sos } = await this.findSosForAdmin(userId, sosId);

        if (sos.status !== GuardSOSStatus.ACTIVE) {
            return error(
                'Invalid Status',
                'Only active alerts can be acknowledged',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos.id,
            },
            data: {
                status: GuardSOSStatus.ACKNOWLEDGED,
                acknowledgedAt: new Date(),
                acknowledgedBy: userId,
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
                incident: true,
            },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'GUARD_SOS_ACKNOWLEDGED',
            description: `SOS alert ${sos.id} acknowledged`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                sosId: sos.id,
                incidentId: sos.incidentId,
            },
        });

        return success(
            updated,
            'SOS Acknowledged',
            'SOS alert acknowledged successfully',
        );
    }

    async escalateGuardSOS(
        userId: string,
        sosId: string,
        dto: EscalateGuardSOSDto,
    ) {
        const { admin, sos } = await this.findSosForAdmin(userId, sosId);

        if (!sos.incidentId) {
            return error(
                'Incident Missing',
                'This SOS alert is not linked to an incident',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedIncident = await this.prisma.incident.update({
            where: { id: sos.incidentId },
            data: {
                status: IncidentStatus.ESCALATED,
                adminNotes: dto.note,
            },
            include: {
                timeline: { orderBy: { createdAt: 'asc' } },
                chatRoom: true,
            },
        });

        await this.appendTimeline({
            incidentId: sos.incidentId,
            event: IncidentTimelineEvent.ESCALATED,
            actorId: userId,
            actorRole: admin.role,
            note: dto.note,
            metadata: { sosId: sos.id },
        });

        const payload = {
            sosId: sos.id,
            incidentId: sos.incidentId,
            status: updatedIncident.status,
            note: dto.note,
            source: 'GUARD_SOS',
        };

        await this.notifyRecipients({
            incidentId: sos.incidentId,
            estateId: admin.estateId,
            event: EmergencyNotificationEvent.ESCALATED,
            payload,
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'GUARD_SOS_ESCALATED',
            description: `SOS alert ${sos.id} escalated`,
            actorId: userId,
            actorRole: admin.role,
            metadata: payload,
        });

        this.incidentGateway.emitEmergencyEscalated(payload);
        this.incidentGateway.emitEmergencyAlarm({
            ...payload,
            alarmType: 'ESCALATION',
            recipientRoles: this.adminRoles,
        });

        return success(
            updatedIncident,
            'SOS Escalated',
            'SOS alert escalated successfully',
        );
    }

    async triggerAlarm(
        userId: string,
        sosId: string,
        dto: TriggerGuardSOSAlarmDto,
    ) {
        const { admin, sos } = await this.findSosForAdmin(userId, sosId);

        if (!sos.incidentId) {
            return error(
                'Incident Missing',
                'This SOS alert is not linked to an incident',
                HttpStatus.BAD_REQUEST,
            );
        }

        const payload = {
            sosId: sos.id,
            incidentId: sos.incidentId,
            note: dto.note,
            source: 'GUARD_SOS',
            alarmType: 'ADMIN_TRIGGERED',
        };

        await this.notifyRecipients({
            incidentId: sos.incidentId,
            estateId: admin.estateId,
            event: EmergencyNotificationEvent.ALARM_TRIGGERED,
            payload,
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'GUARD_SOS_ALARM_TRIGGERED',
            description: `Emergency alarm triggered for SOS alert ${sos.id}`,
            actorId: userId,
            actorRole: admin.role,
            metadata: payload,
        });

        this.incidentGateway.emitEmergencyAlarm({
            ...payload,
            recipientRoles: this.adminRoles,
        });

        return success(payload, 'Alarm Triggered', 'Emergency alarm broadcast');
    }

    async markLiveStreamStarted(userId: string, sosId: string) {
        const guard = await this.getGuard(userId);
        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                guardId: guard.id,
            },
        });

        if (!sos?.incidentId) {
            return error(
                'Not Found',
                'SOS incident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const timeline = await this.appendTimeline({
            incidentId: sos.incidentId,
            event: IncidentTimelineEvent.LIVE_STREAM_STARTED,
            actorId: userId,
            actorRole: Role.GUARD,
            metadata: { sosId },
        });

        this.incidentGateway.emitEmergencyAlert({
            sosId,
            incidentId: sos.incidentId,
            event: IncidentTimelineEvent.LIVE_STREAM_STARTED,
        });

        return success(
            timeline,
            'Live Stream Started',
            'Live stream timeline recorded',
        );
    }

    async resolveGuardSOS(
        userId: string,
        sosId: string,
        dto: ResolveGuardSOSDto,
    ) {
        const { admin, sos } = await this.findSosForAdmin(userId, sosId);

        if (
            sos.status !== GuardSOSStatus.ACTIVE &&
            sos.status !== GuardSOSStatus.ACKNOWLEDGED
        ) {
            return error(
                'Invalid Status',
                'Only active or acknowledged alerts can be resolved',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos.id,
            },
            data: {
                status: GuardSOSStatus.RESOLVED,
                resolvedAt: new Date(),
                resolvedBy: userId,
                resolutionNote: dto.resolutionNote,
                ...(sos.incidentId
                    ? {
                          incident: {
                              update: {
                                  status: IncidentStatus.RESOLVED,
                                  completedAt: new Date(),
                                  completionNote: dto.resolutionNote,
                              },
                          },
                      }
                    : {}),
            },
            include: {
                guard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },
                incident: true,
            },
        });

        if (sos.incidentId) {
            await this.appendTimeline({
                incidentId: sos.incidentId,
                event: IncidentTimelineEvent.RESOLVED,
                actorId: userId,
                actorRole: admin.role,
                note: dto.resolutionNote,
                metadata: { sosId: sos.id },
            });

            await this.closeIncidentChat(sos.incidentId);
        }

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'GUARD_SOS_RESOLVED',
            description: `SOS alert ${sos.id} resolved`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                sosId: sos.id,
                incidentId: sos.incidentId,
                resolutionNote: dto.resolutionNote,
            },
        });

        return success(
            updated,
            'SOS Resolved',
            'SOS alert resolved successfully',
        );
    }

    async closeGuardSOS(userId: string, sosId: string, dto: CloseGuardSOSDto) {
        const { admin, sos } = await this.findSosForAdmin(userId, sosId);

        if (!sos.incidentId) {
            return error(
                'Incident Missing',
                'This SOS alert is not linked to an incident',
                HttpStatus.BAD_REQUEST,
            );
        }

        const incident = await this.prisma.incident.update({
            where: { id: sos.incidentId },
            data: {
                status: IncidentStatus.CLOSED,
                adminNotes: dto.note,
            },
            include: {
                timeline: { orderBy: { createdAt: 'asc' } },
                chatRoom: true,
            },
        });

        await this.appendTimeline({
            incidentId: sos.incidentId,
            event: IncidentTimelineEvent.CLOSED,
            actorId: userId,
            actorRole: admin.role,
            note: dto.note,
            metadata: { sosId: sos.id },
        });

        await this.closeIncidentChat(sos.incidentId);

        await this.notifyRecipients({
            incidentId: sos.incidentId,
            estateId: admin.estateId,
            event: EmergencyNotificationEvent.INCIDENT_CLOSED,
            payload: { sosId: sos.id, incidentId: sos.incidentId },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'GUARD_SOS_CLOSED',
            description: `SOS incident ${sos.incidentId} closed`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                sosId: sos.id,
                incidentId: sos.incidentId,
            },
        });

        return success(
            incident,
            'SOS Closed',
            'SOS incident closed successfully',
        );
    }

    async cancelGuardSOS(userId: string, sosId: string) {
        const guard = await this.getGuard(userId);

        const sos = await this.prisma.guardSOS.findFirst({
            where: {
                id: sosId,
                guardId: guard.id,
            },
        });

        if (!sos) {
            return error(
                'Not Found',
                'SOS alert not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const activeStatuses: GuardSOSStatus[] = [
            GuardSOSStatus.ACTIVE,
            GuardSOSStatus.ACKNOWLEDGED,
        ];

        if (!activeStatuses.includes(sos!.status)) {
            return error(
                'Invalid Status',
                'Only active or acknowledged alerts can be cancelled',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updated = await this.prisma.guardSOS.update({
            where: {
                id: sos!.id,
            },
            data: {
                status: GuardSOSStatus.CANCELLED,
                resolvedAt: new Date(),
                resolvedBy: guard.userId,
                ...(sos!.incidentId
                    ? {
                          incident: {
                              update: {
                                  status: IncidentStatus.FALSE_ALARM,
                                  completedAt: new Date(),
                              },
                          },
                      }
                    : {}),
            },
        });

        if (sos!.incidentId) {
            await this.appendTimeline({
                incidentId: sos!.incidentId,
                event: IncidentTimelineEvent.FALSE_ALARM,
                actorId: userId,
                actorRole: Role.GUARD,
                metadata: { sosId: sos!.id },
            });

            await this.closeIncidentChat(sos!.incidentId);
        }

        await this.createActivityLog({
            estateId: guard.estateId,
            action: 'GUARD_SOS_FALSE_ALARM',
            description: `SOS alert ${sos!.id} cancelled as false alarm`,
            actorId: userId,
            actorRole: Role.GUARD,
            metadata: {
                sosId: sos!.id,
                incidentId: sos!.incidentId,
            },
        });

        return success(
            updated,
            'SOS Cancelled',
            'SOS alert cancelled successfully',
        );
    }

    async listEmergencyContacts(userId: string) {
        const admin = await this.getAdmin(userId);

        const contacts = await this.prisma.emergencyContact.findMany({
            where: { estateId: admin.estateId },
            orderBy: { createdAt: 'desc' },
        });

        return success(
            contacts,
            'Emergency Contacts',
            'Emergency contacts fetched successfully',
        );
    }

    async createEmergencyContact(
        userId: string,
        dto: CreateEmergencyContactDto,
    ) {
        const admin = await this.getAdmin(userId);

        const contact = await this.prisma.emergencyContact.create({
            data: {
                estateId: admin.estateId,
                name: dto.name,
                type: dto.type,
                phone: dto.phone,
                smsPhone: dto.smsPhone,
            },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'EMERGENCY_CONTACT_CREATED',
            description: `Emergency contact ${contact.name} created`,
            actorId: userId,
            actorRole: admin.role,
            metadata: { contactId: contact.id },
        });

        return success(
            contact,
            'Emergency Contact Created',
            'Emergency contact created successfully',
            HttpStatus.CREATED,
        );
    }

    async updateEmergencyContact(
        userId: string,
        contactId: string,
        dto: UpdateEmergencyContactDto,
    ) {
        const admin = await this.getAdmin(userId);

        const existing = await this.prisma.emergencyContact.findFirst({
            where: { id: contactId, estateId: admin.estateId },
        });

        if (!existing) {
            error(
                'Not Found',
                'Emergency contact not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const contact = await this.prisma.emergencyContact.update({
            where: { id: existing!.id },
            data: {
                ...(dto.name !== undefined ? { name: dto.name } : {}),
                ...(dto.type !== undefined ? { type: dto.type } : {}),
                ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
                ...(dto.smsPhone !== undefined
                    ? { smsPhone: dto.smsPhone }
                    : {}),
                ...(dto.isActive !== undefined
                    ? { isActive: dto.isActive }
                    : {}),
            },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: 'EMERGENCY_CONTACT_UPDATED',
            description: `Emergency contact ${contact.name} updated`,
            actorId: userId,
            actorRole: admin.role,
            metadata: { contactId: contact.id },
        });

        return success(
            contact,
            'Emergency Contact Updated',
            'Emergency contact updated successfully',
        );
    }

    private async recordEmergencyContactAction(input: {
        userId: string;
        contactId: string;
        dto: EmergencyContactActionDto;
        action: EmergencyContactActionType;
    }) {
        const admin = await this.getAdmin(input.userId);

        const contact = await this.prisma.emergencyContact.findFirst({
            where: {
                id: input.contactId,
                estateId: admin.estateId,
                isActive: true,
            },
        });

        if (!contact) {
            error(
                'Not Found',
                'Active emergency contact not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (input.dto.incidentId) {
            const incident = await this.prisma.incident.findFirst({
                where: {
                    id: input.dto.incidentId,
                    estateId: admin.estateId,
                },
            });

            if (!incident) {
                error(
                    'Not Found',
                    'Incident not found for this estate',
                    HttpStatus.NOT_FOUND,
                );
            }
        }

        const destination =
            input.action === EmergencyContactActionType.SMS
                ? contact!.smsPhone || contact!.phone
                : contact!.phone;

        const action = await this.prisma.emergencyContactAction.create({
            data: {
                estateId: admin.estateId,
                incidentId: input.dto.incidentId,
                contactId: contact!.id,
                actorId: input.userId,
                action: input.action,
                destination,
                note: input.dto.note,
                metadata: {
                    contactName: contact!.name,
                    message: input.dto.message,
                },
            },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            action: `EMERGENCY_CONTACT_${input.action}`,
            description: `${input.action} action recorded for ${contact!.name}`,
            actorId: input.userId,
            actorRole: admin.role,
            metadata: {
                actionId: action.id,
                contactId: contact!.id,
                incidentId: input.dto.incidentId,
            },
        });

        if (input.dto.incidentId) {
            await this.appendTimeline({
                incidentId: input.dto.incidentId,
                event: IncidentTimelineEvent.ESCALATED,
                actorId: input.userId,
                actorRole: admin.role,
                note: `${input.action} action recorded for ${contact!.name}`,
                metadata: {
                    actionId: action.id,
                    contactId: contact!.id,
                },
            });
        }

        return success(
            action,
            'Emergency Action Recorded',
            'Emergency contact action recorded successfully',
        );
    }

    async recordCallAction(
        userId: string,
        contactId: string,
        dto: EmergencyContactActionDto,
    ) {
        return this.recordEmergencyContactAction({
            userId,
            contactId,
            dto,
            action: EmergencyContactActionType.CALL,
        });
    }

    async recordSmsAction(
        userId: string,
        contactId: string,
        dto: EmergencyContactActionDto,
    ) {
        return this.recordEmergencyContactAction({
            userId,
            contactId,
            dto,
            action: EmergencyContactActionType.SMS,
        });
    }

    async recordSuperAdminEscalation(
        userId: string,
        contactId: string,
        dto: EmergencyContactActionDto,
    ) {
        return this.recordEmergencyContactAction({
            userId,
            contactId,
            dto,
            action: EmergencyContactActionType.SUPER_ADMIN_ESCALATION,
        });
    }
}
