import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { TruckReceptionStatus } from '../domain/truck-reception.entity';

export interface MonitorQueueItemDto {
  id: number;
  numero_turno: number | null;
  license_plate: string;
  entry_at: string;
  status: TruckReceptionStatus;
}

export interface MonitorStatePayload {
  serverTime: string;
  weighingTruckReceptionId: number | null;
  waiting: MonitorQueueItemDto[];
}

@WebSocketGateway({
  namespace: '/logistics',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class LogisticsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  server: Server;
  private logger: Logger = new Logger('LogisticsGateway');
  private connectedClients: Map<string, string> = new Map();
  /** Recepción que el operador tiene seleccionada en la pantalla de pesaje (balanza). */
  private weighingTruckReceptionId: number | null = null;

  constructor(
    @Inject(forwardRef(() => LogisticsService))
    private readonly logisticsService: LogisticsService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('Logistics WebSocket Gateway initialized');
  }

  private async buildMonitorPayload(): Promise<MonitorStatePayload> {
    const rows = await this.logisticsService.getTurnosByDate(new Date());
    const waiting = rows
      .filter((r) => r.status === TruckReceptionStatus.ESPERA)
      .map((r) => ({
        id: r.id,
        numero_turno: r.numero_turno,
        license_plate: r.license_plate,
        entry_at:
          r.entry_at instanceof Date
            ? r.entry_at.toISOString()
            : String(r.entry_at),
        status: r.status,
      }));

    return {
      serverTime: new Date().toISOString(),
      weighingTruckReceptionId: this.weighingTruckReceptionId,
      waiting,
    };
  }

  async broadcastMonitorState(): Promise<void> {
    try {
      const payload = await this.buildMonitorPayload();
      this.server.emit('monitor-state', payload);
      this.logger.log('Broadcast: monitor-state');
    } catch (err) {
      this.logger.error(`broadcastMonitorState: ${err?.message ?? err}`);
    }
  }

  private async sendMonitorStateToClient(client: Socket): Promise<void> {
    try {
      const payload = await this.buildMonitorPayload();
      client.emit('monitor-state', payload);
    } catch (err) {
      this.logger.error(`sendMonitorStateToClient: ${err?.message ?? err}`);
    }
  }

  clearWeighingIfMatches(truckReceptionId: number): void {
    if (this.weighingTruckReceptionId === truckReceptionId) {
      this.weighingTruckReceptionId = null;
    }
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client.handshake.address);
    void this.sendMonitorStateToClient(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('register-truck')
  async handleRegisterTruck(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Register truck received: ${JSON.stringify(data)}`);
      // Procesar el registro del camión
      this.broadcastTruckRegistered(data);
      return { success: true, message: 'Camión registrado exitosamente' };
    } catch (error) {
      this.logger.error(`Error registering truck: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('register-weighing')
  async handleRegisterWeighing(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Register weighing received: ${JSON.stringify(data)}`);
      // Procesar el pesaje
      this.broadcastWeighingUpdated(data);
      return { success: true, message: 'Pesaje registrado exitosamente' };
    } catch (error) {
      this.logger.error(`Error registering weighing: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('get-truck-status')
  async handleGetTruckStatus(
    @MessageBody() truckReceptionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Get truck status for ID: ${truckReceptionId}`);
      // Obtener estado del camión
      return { success: true, status: 'ESPERA' };
    } catch (error) {
      this.logger.error(`Error getting truck status: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('cancel-truck')
  async handleCancelTruck(
    @MessageBody() truckReceptionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.log(`Cancel truck request for ID: ${truckReceptionId}`);
      // Cancelar camión
      this.broadcastTruckCancelled(truckReceptionId);
      return { success: true, message: 'Camión cancelado exitosamente' };
    } catch (error) {
      this.logger.error(`Error cancelling truck: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('weighing-selection')
  async handleWeighingSelection(
    @MessageBody() body: { truck_reception_id?: number | null },
  ) {
    const raw = body?.truck_reception_id;
    this.weighingTruckReceptionId =
      raw === null || raw === undefined ? null : Number(raw);
    await this.broadcastMonitorState();
    return { success: true };
  }

  broadcastTruckRegistered(truckData: any) {
    this.server.emit('truck-registered', {
      timestamp: new Date(),
      data: truckData,
    });
    this.logger.log('Broadcast: truck-registered');
  }

  broadcastWeighingUpdated(weighingData: any) {
    this.server.emit('weighing-updated', {
      timestamp: new Date(),
      data: weighingData,
    });
    this.logger.log('Broadcast: weighing-updated');
  }

  broadcastTruckFinalized(truckData: any) {
    this.server.emit('truck-finalized', {
      timestamp: new Date(),
      data: truckData,
    });
    this.logger.log('Broadcast: truck-finalized');
  }

  broadcastTruckCancelled(truckReceptionId: string) {
    this.server.emit('truck-cancelled', {
      timestamp: new Date(),
      truck_reception_id: truckReceptionId,
    });
    this.logger.log('Broadcast: truck-cancelled');
  }

  broadcastStatusChange(truckReceptionId: string, newStatus: string) {
    this.server.emit('status-changed', {
      timestamp: new Date(),
      truck_reception_id: truckReceptionId,
      status: newStatus,
    });
    this.logger.log(`Broadcast: status-changed to ${newStatus}`);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  sendToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
    this.logger.log(`Message sent to client ${clientId}`);
  }

  broadcastToOthers(fromClientId: string, event: string, data: any) {
    this.server.emit(event, { ...data, timestamp: new Date() });
    this.logger.log(`Broadcast to others: ${event}`);
  }
}
