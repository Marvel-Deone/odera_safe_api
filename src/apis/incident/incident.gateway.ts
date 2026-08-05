import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class IncidentGateway {
    @WebSocketServer()
    server!: Server;

    emitIncidentCreated(payload: any) {
        this.server.emit('incident.ticket.created', payload);
    }

    emitIncidentAssigned(payload: any) {
        this.server.emit('incident.ticket.assigned', payload);
    }

    emitIncidentBreached(payload: any) {
        this.server.emit('incident.ticket.breached', payload);
    }

    emitIncidentCompleted(payload: any) {
        this.server.emit('incident.ticket.completed', payload);
    }

    emitEmergencyAlert(payload: any) {
        this.server.emit('emergency.alert', payload);
        this.server.emit('emergency.modal', payload);
    }

    emitEmergencyAlarm(payload: any) {
        this.server.emit('emergency.alarm', payload);
        this.server.emit('emergency.vibration', payload);
    }

    emitEmergencyVibration(payload: any) {
        this.server.emit('emergency.vibration', payload);
    }

    emitEmergencyEscalated(payload: any) {
        this.server.emit('emergency.escalated', payload);
    }

    emitIncidentChatOpened(payload: any) {
        this.server.emit('incident.chat.opened', payload);
    }

    emitIncidentChatClosed(payload: any) {
        this.server.emit('incident.chat.closed', payload);
    }

    emitResidentSosSilenced(payload: any) {
        this.server.emit('resident-sos.silenced', payload);
    }

    emitResidentSosResolvedAll(payload: any) {
        this.server.emit('resident-sos.resolved-all', payload);
    }
}
