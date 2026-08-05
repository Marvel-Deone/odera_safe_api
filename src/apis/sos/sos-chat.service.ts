import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomType, IncidentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class SosChatService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        tx: Prisma.TransactionClient,
        input: { incidentId: string; estateId: string; title: string; participantIds: string[] },
    ) {
        const room = await tx.chatRoom.create({
            data: {
                incidentId: input.incidentId,
                estateId: input.estateId,
                type: ChatRoomType.INCIDENT,
                name: `Incident Chat - ${input.title}`,
            },
        });

        await tx.incidentChatParticipant.createMany({
            data: [...new Set(input.participantIds)].map((userId) => ({ roomId: room.id, userId })),
            skipDuplicates: true,
        });

        return room;
    }

    async close(tx: Prisma.TransactionClient, incidentId: string) {
        const room = await tx.chatRoom.findUnique({ where: { incidentId } });
        if (!room || room.closedAt) return room;
        return tx.chatRoom.update({ where: { id: room.id }, data: { closedAt: new Date() } });
    }

    async assertParticipant(userId: string, incidentId: string) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { incidentId },
            include: { incident: { select: { status: true } } },
        });
        if (!room) throw new NotFoundException('Incident chat not found');

        const participant = await this.prisma.incidentChatParticipant.findUnique({
            where: { roomId_userId: { roomId: room.id, userId } },
        });
        if (!participant) throw new ForbiddenException('You are not a participant in this SOS chat');

        const readOnly = [IncidentStatus.RESOLVED, IncidentStatus.FALSE_ALARM, IncidentStatus.CLOSED];
        return { room, readOnly: Boolean(room.closedAt) || readOnly.includes(room.incident?.status as IncidentStatus & typeof readOnly[number]) };
    }
}
