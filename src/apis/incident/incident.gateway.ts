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
export class IncidentGateway {
  @WebSocketServer()
  server!: Server

  emitIncidentCreated(payload: any) {
    this.server.emit(
      'incident.ticket.created',
      payload,
    )
  }

  emitIncidentAssigned(payload: any) {
    this.server.emit(
      'incident.ticket.assigned',
      payload,
    )
  }

  emitIncidentBreached(payload: any) {
    this.server.emit(
      'incident.ticket.breached',
      payload,
    )
  }

  emitIncidentCompleted(payload: any) {
    this.server.emit(
      'incident.ticket.completed',
      payload,
    )
  }
}