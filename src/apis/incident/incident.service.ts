import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';
import { IncidentSeverity, IncidentStatus, LogCategory, Role, TicketPriority } from '@prisma/client';
import { CreateIncidentDto, AssignIncidentDto, CompleteIncidentDto, RateIncidentDto } from './dto/incident.dto';
import { IncidentGateway } from './incident.gateway';

@Injectable()
export class IncidentService {
    constructor(private prisma: PrismaService, private readonly incientGateway: IncidentGateway,) { }

    private async createActivityLog(
        data: {
            estateId: string
            category: LogCategory
            action: string
            description: string
            actorId?: string
            actorRole?: Role
            metadata?: any
        },
    ) {
        return this.prisma.activityLog.create({
            data,
        })
    }

    async createIncident(
        userId: string,
        dto: CreateIncidentDto,
    ) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!user) {
            return error(
                'Not Found',
                'User not found',
                HttpStatus.NOT_FOUND,
            )
        }

        let reportedByResidentId: string | null = null
        let reportedByGuardId: string | null = null

        if (user.role === Role.RESIDENT) {
            const resident =
                await this.prisma.resident.findFirst({
                    where: { userId },
                })

            reportedByResidentId = resident?.id ?? null
        }

        if (user.role === Role.GUARD) {
            const guard =
                await this.prisma.guard.findFirst({
                    where: { userId },
                })

            reportedByGuardId = guard?.id ?? null
        }

        const incident =
            await this.prisma.incident.create({
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
                    priority: this.mapPriority(
                        dto.severity,
                    ),
                    slaDeadline:
                        this.calculateSLA(
                            dto.severity,
                        ),
                },

                include: {
                    reportedByResident: true,
                    reportedByGuard: true,
                },
            })

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
        })

        this.incientGateway.emitIncidentCreated(
            incident,
        )

        return success(
            incident,
            'Incident Created',
            'Incident reported successfully',
        )
    }

    // guard incident list
    async getMyIncidents(userId: string) {
        const guard = await this.prisma.guard.findFirst({
            where: { userId },
        })

        if (!guard) {
            return error(
                'Not Found',
                'Guard not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incidents =
            await this.prisma.incident.findMany({
                where: {
                    reportedByGuardId: guard.id,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            incidents,
            'My Incidents',
            'Incident history retrieved successfully',
        )
    }

    // Resident incident list
    async getResidentIncidents(
        userId: string,
    ) {
        const resident =
            await this.prisma.resident.findFirst({
                where: { userId },
            })

        if (!resident) {
            return error(
                'Not Found',
                'Resident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incidents =
            await this.prisma.incident.findMany({
                where: {
                    reportedByResidentId:
                        resident.id,
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            incidents,
            'Resident Incidents',
            'Incidents fetched successfully',
        )
    }

    // Admin incident list
    async getAllIncidents(userId: string) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
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
        const incidents =
            await this.prisma.incident.findMany({
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
                },

                orderBy: {
                    createdAt: 'desc',
                },
            })

        return success(
            incidents,
            'Incidents Retrieved',
            'Incident list fetched successfully',
        )
    }

    async getIncidentById(
        userId: string,
        incidentId: string,
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
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
            }
        })

        if (!incident) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        return success(
            incident,
            'Incident Retrieved',
            'Incident details fetched successfully',
        )
    }

    async updateIncidentStatus(
        userId: string,
        incidentId: string,
        dto: {
            status: IncidentStatus
            adminNotes?: string
        },
    ) {
        const admin = await this.prisma.user.findFirst({
            where: { id: userId },
        })

        if (!admin) {
            return error(
                'Unauthorized',
                'Admin not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const existing = await this.prisma.incident.findFirst({
            where: {
                id: incidentId,
                estateId: admin.estateId,
            },
        })

        if (!existing) {
            return error(
                'Not Found',
                'Incident not found',
                HttpStatus.NOT_FOUND,
            )
        }

        const incident = await this.prisma.incident.update({
            where: {
                id: incidentId,
            },
            data: {
                status: dto.status,
                adminNotes: dto.adminNotes,
            },
        })

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
        })

        return success(
            incident,
            'Incident Updated',
            'Incident status updated successfully',
        )
    }

    async assignIncident(
        incidentId: string,
        dto: AssignIncidentDto,
    ) {
        const incident =
            await this.prisma.incident.update({
                where: {
                    id: incidentId,
                },

                data: {
                    assignedToGuardId:
                        dto.assignedToId,

                    status:
                        IncidentStatus.UNDER_REVIEW,
                },

                include: {
                    assignedToGuard: true,
                },
            })

        this.incientGateway.emitIncidentAssigned(
            incident,
        )

        return success(
            incident,
            'Incident Assigned',
            'Success',
        )
    }

    async getTechQueue(userId: string) {
        const guard =
            await this.prisma.guard.findFirst({
                where: {
                    userId,
                },
            })

        const incidents =
            await this.prisma.incident.findMany({
                where: {
                    assignedToGuardId:
                        guard?.id,

                    status: {
                        in: [
                            IncidentStatus.UNDER_REVIEW,
                            IncidentStatus.ESCALATED,
                        ],
                    },
                },

                orderBy: {
                    priority: 'asc',
                },
            })

        return success(
            incidents,
            'Queue fetched',
            'Success',
        )
    }

    async startIncident(id: string) {
        const incident =
            await this.prisma.incident.update({
                where: {
                    id,
                },

                data: {
                    startedAt: new Date(),
                    status:
                        IncidentStatus.UNDER_REVIEW,
                },
            })

        return success(
            incident,
            'Incident started',
            'Success',
        )
    }

    async completeIncident(
        id: string,
        dto: CompleteIncidentDto,
    ) {
        const incident =
            await this.prisma.incident.update({
                where: {id},

                data: {
                    status: IncidentStatus.RESOLVED,
                    afterPhotos: dto.afterPhotos ?? [],
                    completionNote: dto.completionNote,
                    materialsUsed: dto.materialsUsed,
                    timeTaken: dto.timeTaken,
                    completedAt: new Date(),
                },
            })

        this.incientGateway.emitIncidentCompleted(
            incident,
        )

        return success(
            incident,
            'Incident completed',
            'Success',
        )
    }

    async rateIncident(
        id: string,
        dto: RateIncidentDto,
    ) {
        const incident =
            await this.prisma.incident.update({
                where: {
                    id,
                },

                data: {
                    residentRating:
                        dto.rating,
                },
            })

        return success(
            incident,
            'Rating submitted',
            'Success',
        )
    }

    // Helpers
    private mapPriority(
        severity: IncidentSeverity,
    ): TicketPriority {
        switch (severity) {
            case IncidentSeverity.CRITICAL:
                return TicketPriority.P1_CRITICAL

            case IncidentSeverity.HIGH:
                return TicketPriority.P2_URGENT

            default:
                return TicketPriority.P3_ROUTINE
        }
    }

    private calculateSLA(
        severity: IncidentSeverity,
    ): Date {
        const deadline = new Date()

        switch (severity) {
            case IncidentSeverity.CRITICAL:
                deadline.setHours(
                    deadline.getHours() + 2,
                )
                break

            case IncidentSeverity.HIGH:
                deadline.setHours(
                    deadline.getHours() + 8,
                )
                break

            default:
                deadline.setHours(
                    deadline.getHours() + 24,
                )
        }

        return deadline
    }
}
