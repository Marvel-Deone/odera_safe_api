import {
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import {
    SupportTicketStatus,
    SupportTicketTimelineEvent,
} from '@prisma/client';
import { error, success } from '../../common/utils/response.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
    CancelSupportTicketDto,
    CreateSupportTicketDto,
    ResolveSupportTicketDto,
} from './dto/support-ticket.dto';

@Injectable()
export class SupportTicketService {
    private readonly logger = new Logger(SupportTicketService.name);

    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, dto: CreateSupportTicketDto) {
        try {
            const user = await this.getUser(userId);

            if (!user) {
                return error(
                    'Not Found',
                    'User not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const ticket = await this.prisma.$transaction(async (tx) => {
                const created = await tx.supportTicket.create({
                    data: {
                        estateId: user.estateId,
                        createdById: user.id,
                        reference: this.reference('support_ticket'),
                        title: dto.title,
                        description: dto.description,
                        category: dto.category,
                        ...(dto.priority
                            ? { priority: dto.priority }
                            : {}),
                    },
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                });

                await tx.supportTicketTimelineEntry.create({
                    data: {
                        supportTicketId: created.id,
                        event: SupportTicketTimelineEvent.CREATED,
                        actorId: user.id,
                        actorRole: user.role,
                        note: 'Support ticket created',
                    },
                });

                return created;
            });

            return success(
                ticket,
                'Support Ticket Created',
                'Support ticket created successfully',
            );
        } catch (err) {
            this.logger.error(
                `Create support ticket failed. User: ${userId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to create support ticket',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getMine(userId: string) {
        try {
            const tickets = await this.prisma.supportTicket.findMany({
                where: {
                    createdById: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return success(
                tickets,
                'My Support Tickets',
                'Support tickets retrieved successfully',
            );
        } catch (err) {
            this.logger.error(
                `Get support tickets failed. User: ${userId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to retrieve support tickets',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getMineById(userId: string, ticketId: string) {
        try {
            const ticket = await this.prisma.supportTicket.findFirst({
                where: {
                    id: ticketId,
                    createdById: userId,
                },
                include: {
                    resolvedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    cancelledBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    timeline: {
                        include: {
                            actor: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            });

            if (!ticket) {
                return error(
                    'Not Found',
                    'Support ticket not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return success(
                ticket,
                'Support Ticket',
                'Support ticket retrieved successfully',
            );
        } catch (err) {
            this.logger.error(
                `Get support ticket failed. User: ${userId}, Ticket: ${ticketId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to retrieve support ticket',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getAll(userId: string) {
        try {
            const user = await this.getUser(userId);

            if (!user) {
                return error(
                    'Not Found',
                    'User not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const tickets = await this.prisma.supportTicket.findMany({
                where: {
                    estateId: user.estateId,
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    resolvedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    cancelledBy: {
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
            });

            return success(
                tickets,
                'Support Tickets',
                'Support ticket list retrieved successfully',
            );
        } catch (err) {
            this.logger.error(
                `Get all support tickets failed. User: ${userId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to retrieve support tickets',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getById(userId: string, ticketId: string) {
        try {
            const user = await this.getUser(userId);

            if (!user) {
                return error(
                    'Not Found',
                    'User not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const ticket = await this.prisma.supportTicket.findFirst({
                where: {
                    id: ticketId,
                    estateId: user.estateId,
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    resolvedBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    cancelledBy: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    timeline: {
                        include: {
                            actor: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            });

            if (!ticket) {
                return error(
                    'Not Found',
                    'Support ticket not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            return success(
                ticket,
                'Support Ticket',
                'Support ticket retrieved successfully',
            );
        } catch (err) {
            this.logger.error(
                `Get support ticket failed. User: ${userId}, Ticket: ${ticketId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to retrieve support ticket',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async resolve(
        userId: string,
        ticketId: string,
        dto: ResolveSupportTicketDto,
    ) {
        try {
            const user = await this.getUser(userId);

            if (!user) {
                return error(
                    'Not Found',
                    'User not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const existing = await this.prisma.supportTicket.findFirst({
                where: {
                    id: ticketId,
                    estateId: user.estateId,
                },
            });

            if (!existing) {
                return error(
                    'Not Found',
                    'Support ticket not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (existing.status !== SupportTicketStatus.OPEN) {
                return error(
                    'Invalid Status',
                    'Only unresolved support tickets can be resolved',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const ticket = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.supportTicket.update({
                    where: {
                        id: ticketId,
                    },
                    data: {
                        status: SupportTicketStatus.RESOLVED,
                        resolvedById: user.id,
                        resolvedAt: new Date(),
                        resolutionNote: dto.resolutionNote,
                    },
                });

                await tx.supportTicketTimelineEntry.create({
                    data: {
                        supportTicketId: ticketId,
                        event: SupportTicketTimelineEvent.RESOLVED,
                        actorId: user.id,
                        actorRole: user.role,
                        note: dto.resolutionNote,
                    },
                });

                return updated;
            });

            return success(
                ticket,
                'Support Ticket Resolved',
                'Support ticket resolved successfully',
            );
        } catch (err) {
            this.logger.error(
                `Resolve support ticket failed. User: ${userId}, Ticket: ${ticketId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to resolve support ticket',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async cancel(
        userId: string,
        ticketId: string,
        dto: CancelSupportTicketDto,
    ) {
        try {
            const user = await this.getUser(userId);

            if (!user) {
                return error(
                    'Not Found',
                    'User not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            const existing = await this.prisma.supportTicket.findFirst({
                where: {
                    id: ticketId,
                    estateId: user.estateId,
                },
            });

            if (!existing) {
                return error(
                    'Not Found',
                    'Support ticket not found',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (existing.status !== SupportTicketStatus.OPEN) {
                return error(
                    'Invalid Status',
                    'Only unresolved support tickets can be cancelled',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const ticket = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.supportTicket.update({
                    where: {
                        id: ticketId,
                    },
                    data: {
                        status: SupportTicketStatus.CANCELLED,
                        cancelledById: user.id,
                        cancelledAt: new Date(),
                        cancellationNote: dto.cancellationNote,
                    },
                });

                await tx.supportTicketTimelineEntry.create({
                    data: {
                        supportTicketId: ticketId,
                        event: SupportTicketTimelineEvent.CANCELLED,
                        actorId: user.id,
                        actorRole: user.role,
                        note: dto.cancellationNote,
                    },
                });

                return updated;
            });

            return success(
                ticket,
                'Support Ticket Cancelled',
                'Support ticket cancelled successfully',
            );
        } catch (err) {
            this.logger.error(
                `Cancel support ticket failed. User: ${userId}, Ticket: ${ticketId}`,
                this.getErrorStack(err),
            );

            return error(
                'Failed to cancel support ticket',
                this.getErrorMessage(err),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private async getUser(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                estateId: true,
                role: true,
            },
        });
    }

    private reference(prefix: string) {
        return `${prefix}_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 10)}`;
    }

    private getErrorMessage(err: unknown) {
        return err instanceof Error ? err.message : 'Unknown error';
    }

    private getErrorStack(err: unknown) {
        return err instanceof Error ? err.stack : undefined;
    }
}
