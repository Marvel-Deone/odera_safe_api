import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';
import {
    ChatRoomType,
    EmergencyNotificationEvent,
    IncidentCategory,
    IncidentSeverity,
    IncidentStatus,
    IncidentTimelineEvent,
    LogCategory,
    Role,
    TicketPriority,
} from '@prisma/client';
import {
    CreateIncidentDto,
    AssignIncidentDto,
    CompleteIncidentDto,
    RateIncidentDto,
    CreateResidentSOSDto,
    ResolveAllResidentSOSDto,
    SilenceResidentSOSDto,
} from './dto/incident.dto';
import { IncidentGateway } from './incident.gateway';

@Injectable()
export class IncidentService {
    constructor(
        private prisma: PrismaService,
        private readonly incientGateway: IncidentGateway,
    ) {}

    private async createActivityLog(data: {
        estateId: string;
        category: LogCategory;
        action: string;
        description: string;
        actorId?: string;
        actorRole?: Role;
        metadata?: any;
    }) {
        return this.prisma.activityLog.create({
            data,
        });
    }

    private async getIncidentParticipants(input: {
        estateId: string;
        reporterUserId: string;
        source: 'RESIDENT' | 'GUARD';
    }) {
        const roles: Role[] =
            input.source === 'RESIDENT'
                ? [Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN]
                : [Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN];

        return this.prisma.user.findMany({
            where: {
                estateId: input.estateId,
                OR: [{ id: input.reporterUserId }, { role: { in: roles } }],
            },
            select: {
                id: true,
                role: true,
                email: true,
            },
        });
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
                name: `Incident Chat - ${input.title}`,
            },
        });

        await this.prisma.incidentChatParticipant.createMany({
            data: [...new Set(input.participantIds)].map((userId) => ({
                roomId: room.id,
                userId,
            })),
            skipDuplicates: true,
        });

        this.incientGateway.emitIncidentChatOpened({
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
            return;
        }

        const closed = await this.prisma.chatRoom.update({
            where: { id: room.id },
            data: { closedAt: new Date() },
        });

        this.incientGateway.emitIncidentChatClosed({
            incidentId,
            roomId: closed.id,
            closedAt: closed.closedAt,
        });
    }

    private mapTimelineEvent(status: IncidentStatus) {
        switch (status) {
            case IncidentStatus.ESCALATED:
                return IncidentTimelineEvent.ESCALATED;
            case IncidentStatus.RESOLVED:
                return IncidentTimelineEvent.RESOLVED;
            case IncidentStatus.FALSE_ALARM:
                return IncidentTimelineEvent.FALSE_ALARM;
            case IncidentStatus.CLOSED:
                return IncidentTimelineEvent.CLOSED;
            default:
                return null;
        }
    }

    async createIncident(userId: string, dto: CreateIncidentDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return error('Not Found', 'User not found', HttpStatus.NOT_FOUND);
        }

        let reportedByResidentId: string | null = null;
        let reportedByGuardId: string | null = null;

        if (user.role === Role.RESIDENT) {
            const resident = await this.prisma.resident.findFirst({
                where: { userId },
            });

            reportedByResidentId = resident?.id ?? null;
        }

        if (user.role === Role.GUARD || user.role === Role.SUPER_GUARD) {
            const guard = await this.prisma.guard.findFirst({
                where: { userId },
            });

            reportedByGuardId = guard?.id ?? null;
        }

        const incident = await this.prisma.incident.create({
            data: {
                estateId: user.estateId,
                reportedByResidentId,
                reportedByGuardId,
                title: dto.title,
                category: dto.category,
                description: dto.description,
                severity: dto.severity,
                photos: dto.beforePhotos ?? [],
                location: dto.location,
                occurredAt: dto.occurredAt
                    ? new Date(dto.occurredAt)
                    : new Date(),
                priority: this.mapPriority(dto.severity),
                slaDeadline: this.calculateSLA(dto.severity),
            },

            include: {
                reportedByResident: true,
                reportedByGuard: true,
                timeline: {
                    orderBy: { createdAt: 'asc' },
                },
                chatRoom: true,
            },
        });

        await this.prisma.incidentTimelineEntry.create({
            data: {
                incidentId: incident.id,
                event: IncidentTimelineEvent.SOS_TRIGGERED,
                actorId: user.id,
                actorRole: user.role,
                location: incident.location,
                metadata: {
                    source:
                        user.role === Role.RESIDENT
                            ? 'RESIDENT_INCIDENT'
                            : 'GUARD_INCIDENT',
                    category: incident.category,
                    severity: incident.severity,
                },
            },
        });

        const source = user.role === Role.RESIDENT ? 'RESIDENT' : 'GUARD';
        const participants = await this.getIncidentParticipants({
            estateId: user.estateId,
            reporterUserId: user.id,
            source,
        });

        const room = await this.createIncidentChat({
            incidentId: incident.id,
            estateId: user.estateId,
            title: incident.title,
            participantIds: participants.map((participant) => participant.id),
        });

        if (incident.category === IncidentCategory.EMERGENCY) {
            const recipientRoles: Role[] = [
                Role.ADMIN,
                Role.SUPER_ADMIN,
                Role.SUPER_GUARD,
            ];
            const recipients = participants.filter((participant) =>
                recipientRoles.includes(participant.role),
            );

            await this.prisma.emergencyNotification.createMany({
                data: recipients.map((recipient) => ({
                    incidentId: incident.id,
                    recipientId: recipient.id,
                    event: EmergencyNotificationEvent.SOS_TRIGGERED,
                    metadata: {
                        source,
                        roomId: room.id,
                    },
                })),
                skipDuplicates: true,
            });

            await this.prisma.incidentTimelineEntry.create({
                data: {
                    incidentId: incident.id,
                    event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
                    note: `${recipients.length} emergency notifications sent`,
                    metadata: {
                        recipientIds: recipients.map(
                            (recipient) => recipient.id,
                        ),
                    },
                },
            });
        }

        await this.createActivityLog({
            estateId: user.estateId,
            category: LogCategory.SECURITY,
            action: 'INCIDENT_CREATED',
            description: incident.title,
            actorId: user.id,
            actorRole: user.role,
            metadata: {
                incidentId: incident.id,
                severity: incident.severity,
                category: incident.category,
            },
        });

        const responseData = {
            ...incident,
            chatRoom: room,
            participants,
        };

        this.incientGateway.emitIncidentCreated(responseData);

        if (incident.category === IncidentCategory.EMERGENCY) {
            const payload = {
                incidentId: incident.id,
                roomId: room.id,
                source,
                incident,
            };

            this.incientGateway.emitEmergencyAlert(payload);
            this.incientGateway.emitEmergencyAlarm({
                ...payload,
                alarmType: `${source}_SOS`,
            });
        }

        return success(
            responseData,
            'Incident Created',
            'Incident reported successfully',
        );
    }

    // guard incident list
    async getMyIncidents(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        });

        if (!guard) {
            return error('Not Found', 'Guard not found', HttpStatus.NOT_FOUND);
        }

        const incidents = await this.prisma.incident.findMany({
            where: {
                reportedByGuardId: guard.id,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });

        return success(
            incidents,
            'My Incidents',
            'Incident history retrieved successfully',
        );
    }

    // Resident incident list
    async getResidentIncidents(userId: string) {
        const resident = await this.prisma.resident.findFirst({
            where: { userId },
        });

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const incidents = await this.prisma.incident.findMany({
            where: {
                reportedByResidentId: resident.id,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });

        return success(
            incidents,
            'Resident Incidents',
            'Incidents fetched successfully',
        );
    }

    // Admin incident list
    async getAllIncidents(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        });

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            );
        }

        // const incidents = await this.prisma.incident.findMany({
        //     where: {
        //         estateId: admin.estateId,
        //     },
        //     include: {
        //         guard: {
        //             select: {
        //                 id: true,
        //                 full_name: true,
        //                 zone_assignment: true,
        //             },
        //         },
        //     },
        //     orderBy: {
        //         createdAt: 'desc',
        //     },
        // })
        const incidents = await this.prisma.incident.findMany({
            where: {
                estateId: admin.estateId,
            },

            include: {
                reportedByGuard: {
                    select: {
                        id: true,
                        full_name: true,
                        zone_assignment: true,
                    },
                },

                reportedByResident: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        house_no: true,
                        block: true,
                    },
                },

                assignedToGuard: {
                    select: {
                        id: true,
                        full_name: true,
                    },
                },

                assignedToUser: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                timeline: {
                    orderBy: { createdAt: 'asc' },
                },
                chatRoom: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });

        return success(
            incidents,
            'Incidents Retrieved',
            'Incident list fetched successfully',
        );
    }

    async getIncidentById(userId: string, incidentId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        });

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const incident = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
            },
            include: {
                reportedByGuard: true,
                reportedByResident: true,
                assignedToGuard: true,
                assignedToUser: true,
                timeline: {
                    orderBy: { createdAt: 'asc' },
                },
                chatRoom: true,
            },
        });

        if (!incident) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        return success(
            incident,
            'Incident Retrieved',
            'Incident details fetched successfully',
        );
    }

    async updateIncidentStatus(
        userId: string,
        incidentId: string,
        dto: {
            status: IncidentStatus;
            adminNotes?: string;
        },
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        });

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const existing = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
            },
        });

        if (!existing) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const incident = await this.prisma.incident.update({
            where: {
                id: incidentId,
            },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes,
            },
        });

        const timelineEvent = this.mapTimelineEvent(dto.status);

        if (timelineEvent) {
            await this.prisma.incidentTimelineEntry.create({
                data: {
                    incidentId,
                    event: timelineEvent,
                    actorId: userId,
                    actorRole: admin.role,
                    note: dto.adminNotes,
                    metadata: {
                        status: dto.status,
                    },
                },
            });
        }

        const closingStatuses: IncidentStatus[] = [
            IncidentStatus.RESOLVED,
            IncidentStatus.FALSE_ALARM,
            IncidentStatus.CLOSED,
        ];

        if (closingStatuses.includes(dto.status)) {
            await this.closeIncidentChat(incidentId);
        }

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'INCIDENT_UPDATED',
            description: `Incident ${incident.title} marked ${dto.status}`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                incidentId,
                status: dto.status,
            },
        });

        return success(
            incident,
            'Incident Updated',
            'Incident status updated successfully',
        );
    }

    async assignIncident(incidentId: string, dto: AssignIncidentDto) {
        const incident = await this.prisma.incident.update({
            where: {
                id: incidentId,
            },

            data: {
                assignedToGuardId: dto.assignedToId,

                status: IncidentStatus.UNDER_REVIEW,
            },

            include: {
                assignedToGuard: true,
            },
        });

        this.incientGateway.emitIncidentAssigned(incident);

        return success(
            incident,
            'Incident Assigned',
            'Incident assigned to guard successfully',
        );
    }

    async getTechQueue(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: {
                userId,
            },
        });

        const incidents = await this.prisma.incident.findMany({
            where: {
                assignedToGuardId: guard?.id,

                status: {
                    in: [IncidentStatus.UNDER_REVIEW, IncidentStatus.ESCALATED],
                },
            },

            orderBy: {
                priority: 'asc',
            },
        });

        return success(incidents, 'Queue fetched', 'Success');
    }

    async startIncident(id: string) {
        const incident = await this.prisma.incident.update({
            where: {
                id,
            },

            data: {
                startedAt: new Date(),
                status: IncidentStatus.UNDER_REVIEW,
            },
        });

        return success(incident, 'Incident started', 'Success');
    }

    async completeIncident(id: string, dto: CompleteIncidentDto) {
        const incident = await this.prisma.incident.update({
            where: { id },

            data: {
                status: IncidentStatus.RESOLVED,
                afterPhotos: dto.afterPhotos ?? [],
                completionNote: dto.completionNote,
                materialsUsed: dto.materialsUsed,
                timeTaken: dto.timeTaken,
                completedAt: new Date(),
            },
        });

        await this.prisma.incidentTimelineEntry.create({
            data: {
                incidentId: id,
                event: IncidentTimelineEvent.RESOLVED,
                note: dto.completionNote,
                metadata: {
                    materialsUsed: dto.materialsUsed,
                    timeTaken: dto.timeTaken,
                },
            },
        });

        await this.closeIncidentChat(id);

        this.incientGateway.emitIncidentCompleted(incident);

        return success(incident, 'Incident completed', 'Success');
    }

    async rateIncident(id: string, dto: RateIncidentDto) {
        const incident = await this.prisma.incident.update({
            where: {
                id,
            },

            data: {
                residentRating: dto.rating,
            },
        });

        return success(incident, 'Rating submitted', 'Success');
    }

    async createResidentSOS(userId: string, dto: CreateResidentSOSDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                resident: {
                    include: {
                        street: true,
                    },
                },
            },
        });

        if (!user?.resident) {
            return error(
                'Not Found',
                'Resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const resident = user.resident;
        const streetName = resident.street?.name;
        const locationLabel = [
            resident.house_no ? `House No. ${resident.house_no}` : null,
            streetName ? `${streetName} Street` : null,
        ]
            .filter(Boolean)
            .join(', ');
        const message =
            dto.message ||
            `A problem is coming from ${locationLabel || 'a resident home'}`;

        const incident = await this.prisma.incident.create({
            data: {
                estateId: user.estateId,
                reportedByResidentId: resident.id,
                title: 'Resident SOS',
                category: IncidentCategory.EMERGENCY,
                description: message,
                severity: IncidentSeverity.CRITICAL,
                priority: TicketPriority.P1_CRITICAL,
                location: locationLabel || undefined,
                status: IncidentStatus.OPEN,
                slaDeadline: this.calculateSLA(IncidentSeverity.CRITICAL),
            },
            include: {
                reportedByResident: {
                    include: { street: true },
                },
            },
        });

        await this.prisma.incidentTimelineEntry.create({
            data: {
                incidentId: incident.id,
                event: IncidentTimelineEvent.SOS_TRIGGERED,
                actorId: user.id,
                actorRole: Role.RESIDENT,
                location: locationLabel,
                metadata: {
                    source: 'RESIDENT_SOS',
                    houseNo: resident.house_no,
                    streetId: resident.streetId,
                    streetName,
                },
            },
        });

        const participants = await this.prisma.user.findMany({
            where: { estateId: user.estateId },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        const room = await this.createIncidentChat({
            incidentId: incident.id,
            estateId: user.estateId,
            title: 'Resident SOS',
            participantIds: participants.map((participant) => participant.id),
        });

        await this.prisma.emergencyNotification.createMany({
            data: participants.map((participant) => ({
                incidentId: incident.id,
                recipientId: participant.id,
                event: EmergencyNotificationEvent.SOS_TRIGGERED,
                metadata: {
                    source: 'RESIDENT_SOS',
                    roomId: room.id,
                    locationLabel,
                },
            })),
            skipDuplicates: true,
        });

        await this.prisma.incidentTimelineEntry.create({
            data: {
                incidentId: incident.id,
                event: IncidentTimelineEvent.NOTIFICATIONS_SENT,
                note: `${participants.length} resident SOS notifications sent`,
                metadata: {
                    source: 'RESIDENT_SOS',
                    recipientIds: participants.map(
                        (participant) => participant.id,
                    ),
                },
            },
        });

        await this.createActivityLog({
            estateId: user.estateId,
            category: LogCategory.SECURITY,
            action: 'RESIDENT_SOS_TRIGGERED',
            description: message,
            actorId: user.id,
            actorRole: Role.RESIDENT,
            metadata: {
                incidentId: incident.id,
                roomId: room.id,
                locationLabel,
            },
        });

        const payload = {
            source: 'RESIDENT_SOS',
            incidentId: incident.id,
            roomId: room.id,
            resident: {
                id: resident.id,
                first_name: resident.first_name,
                last_name: resident.last_name,
                house_no: resident.house_no,
                street: resident.street
                    ? {
                          id: resident.street.id,
                          name: resident.street.name,
                      }
                    : null,
            },
            locationLabel,
            message,
            incident,
        };

        this.incientGateway.emitEmergencyAlert(payload);
        this.incientGateway.emitEmergencyVibration(payload);
        this.incientGateway.emitIncidentCreated({
            ...incident,
            chatRoom: room,
            participants,
            source: 'RESIDENT_SOS',
        });

        return success(
            {
                incident,
                chatRoom: room,
                participants,
                locationLabel,
            },
            'Resident SOS Triggered',
            'Resident SOS sent successfully',
            HttpStatus.CREATED,
        );
    }

    async silenceResidentSOS(
        userId: string,
        incidentId: string,
        dto: SilenceResidentSOSDto,
    ) {
        const admin = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!admin) {
            return error('Not Found', 'Admin not found', HttpStatus.NOT_FOUND);
        }

        const incident = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
                category: IncidentCategory.EMERGENCY,
                reportedByResidentId: { not: null },
            },
            include: {
                reportedByResident: {
                    include: { street: true },
                },
                chatRoom: true,
            },
        });

        if (!incident) {
            return error(
                'Not Found',
                'Resident SOS incident not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const silenced = await this.prisma.incident.update({
            where: { id: incident.id },
            data: {
                silencedAt: new Date(),
                silencedBy: userId,
                adminNotes: dto.note,
            },
            include: {
                reportedByResident: {
                    include: { street: true },
                },
                chatRoom: true,
            },
        });

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'RESIDENT_SOS_SILENCED',
            description: `Resident SOS ${incident.id} silenced`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                incidentId: incident.id,
                note: dto.note,
            },
        });

        const payload = {
            source: 'RESIDENT_SOS',
            incidentId: incident.id,
            silencedAt: silenced.silencedAt,
            note: dto.note,
        };

        this.incientGateway.emitResidentSosSilenced(payload);

        return success(
            silenced,
            'Resident SOS Silenced',
            'Resident SOS vibration silenced successfully',
        );
    }

    async resolveAllResidentSOS(userId: string, dto: ResolveAllResidentSOSDto) {
        const admin = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!admin) {
            return error('Not Found', 'Admin not found', HttpStatus.NOT_FOUND);
        }

        const activeStatuses: IncidentStatus[] = [
            IncidentStatus.OPEN,
            IncidentStatus.UNDER_REVIEW,
            IncidentStatus.ESCALATED,
            IncidentStatus.ASSIGNED,
            IncidentStatus.IN_PROGRESS,
        ];

        const incidents = await this.prisma.incident.findMany({
            where: {
                estateId: admin.estateId,
                category: IncidentCategory.EMERGENCY,
                reportedByResidentId: { not: null },
                status: { in: activeStatuses },
            },
            select: { id: true },
        });

        const resolvedAt = new Date();
        const resolvedIncidentIds = incidents.map((incident) => incident.id);

        if (resolvedIncidentIds.length) {
            await this.prisma.incident.updateMany({
                where: { id: { in: resolvedIncidentIds } },
                data: {
                    status: IncidentStatus.RESOLVED,
                    completedAt: resolvedAt,
                    completionNote: dto.resolutionNote,
                },
            });

            await this.prisma.incidentTimelineEntry.createMany({
                data: resolvedIncidentIds.map((id) => ({
                    incidentId: id,
                    event: IncidentTimelineEvent.RESOLVED,
                    actorId: userId,
                    actorRole: admin.role,
                    note: dto.resolutionNote,
                    metadata: { source: 'RESIDENT_SOS_RESOLVE_ALL' },
                })),
            });

            await Promise.all(
                resolvedIncidentIds.map((id) => this.closeIncidentChat(id)),
            );
        }

        await this.createActivityLog({
            estateId: admin.estateId,
            category: LogCategory.SECURITY,
            action: 'RESIDENT_SOS_RESOLVED_ALL',
            description: `${resolvedIncidentIds.length} resident SOS alerts resolved`,
            actorId: userId,
            actorRole: admin.role,
            metadata: {
                resolvedIncidentIds,
                resolutionNote: dto.resolutionNote,
            },
        });

        const payload = {
            source: 'RESIDENT_SOS',
            resolvedIncidentIds,
            resolvedAt,
        };

        this.incientGateway.emitResidentSosResolvedAll(payload);

        return success(
            payload,
            'Resident SOS Resolved',
            'All active resident SOS alerts resolved successfully',
        );
    }

    // Helpers
    private mapPriority(severity: IncidentSeverity): TicketPriority {
        switch (severity) {
            case IncidentSeverity.CRITICAL:
                return TicketPriority.P1_CRITICAL;

            case IncidentSeverity.HIGH:
                return TicketPriority.P2_URGENT;

            default:
                return TicketPriority.P3_ROUTINE;
        }
    }

    private calculateSLA(severity: IncidentSeverity): Date {
        const deadline = new Date();

        switch (severity) {
            case IncidentSeverity.CRITICAL:
                deadline.setHours(deadline.getHours() + 2);
                break;

            case IncidentSeverity.HIGH:
                deadline.setHours(deadline.getHours() + 8);
                break;

            default:
                deadline.setHours(deadline.getHours() + 24);
        }

        return deadline;
    }
}
