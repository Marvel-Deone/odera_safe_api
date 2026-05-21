import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'

import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GuardLocationGateway {
  @WebSocketServer()
  server!: Server

  broadcastLocationUpdate(
    payload: any,
  ) {
    this.server.emit(
      'guard.location.updated',
      payload,
    )
  }
}