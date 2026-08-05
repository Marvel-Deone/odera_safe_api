import { ForbiddenException, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../../database/prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class SosGateway implements OnGatewayConnection {
    @WebSocketServer() server!: Server;

    constructor(private readonly prisma: PrismaService) {}

    handleConnection(socket: Socket): void {
        const user = socket.data.user as { id: string; estateId: string; role: string } | undefined;
        if (!user) {
            socket.disconnect(true);
            return;
        }
        socket.join(`user:${user.id}`);
        socket.join(`estate:${user.estateId}`);
        socket.join(`role:${user.role}`);
    }

    @SubscribeMessage('sos.chat.join')
    async joinIncident(
        @ConnectedSocket() socket: Socket,
        @MessageBody() body: { incidentId: string },
    ) {
        const user = socket.data.user as { id: string };
        const room = await this.prisma.chatRoom.findUnique({ where: { incidentId: body.incidentId } });
        if (!room) throw new ForbiddenException('Incident chat not found');

        const participant = await this.prisma.incidentChatParticipant.findUnique({
            where: { roomId_userId: { roomId: room.id, userId: user.id } },
        });
        if (!participant) throw new ForbiddenException('Incident chat access denied');

        await socket.join(`incident:${body.incidentId}`);
        return { joined: true, incidentId: body.incidentId, roomId: room.id };
    }

    emitToUsers(userIds: string[], event: string, payload: unknown): void {
        const rooms = [...new Set(userIds)].map((id) => `user:${id}`);
        if (rooms.length) this.server.to(rooms).emit(event, payload);
    }

    emitToIncident(incidentId: string, event: string, payload: unknown): void {
        this.server.to(`incident:${incidentId}`).emit(event, payload);
    }
}
