import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway
    implements OnGatewayConnection {
    @WebSocketServer()
    server!: Server

    handleConnection(
        client: Socket,
    ) {
        console.log(
            'Chat connected:',
            client.id,
        )
    }

    @SubscribeMessage(
        'join-room',
    )
    handleJoinRoom(
        @MessageBody()
        roomId: string,

        @ConnectedSocket()
        client: Socket,
    ) {
        console.log(
            `Client ${client.id} joined room ${roomId}`,
        )
        client.join(roomId)
    }

    emitMessage(
        roomId: string,
        message: any,
    ) {
        console.log('Emitting to room:', roomId)

        this.server
            .to(roomId)
            .emit(
                'new-message',
                message,
            )
    }
}