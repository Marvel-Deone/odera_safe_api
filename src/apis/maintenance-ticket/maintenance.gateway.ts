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
export class MaintenanceGateway {
  @WebSocketServer()
  server!: Server

  emitNewTicket(payload: any) {
    this.server.emit(
      'maintenance.ticket.created',
      payload,
    )
  }

  emitAssigned(payload: any) {
    this.server.emit(
      'maintenance.ticket.assigned',
      payload,
    )
  }

  emitBreached(payload: any) {
    this.server.emit(
      'maintenance.ticket.breached',
      payload,
    )
  }

  emitCompleted(payload: any) {
    this.server.emit(
      'maintenance.ticket.completed',
      payload,
    )
  }
}