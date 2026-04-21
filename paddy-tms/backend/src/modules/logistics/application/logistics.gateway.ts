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
import { Logger } from '@nestjs/common';
import { LogisticsService } from './logistics.service';

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

  constructor(private readonly logisticsService: LogisticsService) {}

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('Logistics WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client.handshake.address);
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

  /**
   * Broadcast para notificar que un camión ha sido registrado
   */
  broadcastTruckRegistered(truckData: any) {
    this.server.emit('truck-registered', {
      timestamp: new Date(),
      data: truckData,
    });
    this.logger.log('Broadcast: truck-registered');
  }

  /**
   * Broadcast para notificar actualización de pesaje
   */
  broadcastWeighingUpdated(weighingData: any) {
    this.server.emit('weighing-updated', {
      timestamp: new Date(),
      data: weighingData,
    });
    this.logger.log('Broadcast: weighing-updated');
  }

  /**
   * Broadcast para notificar que un camión ha sido finalizado
   */
  broadcastTruckFinalized(truckData: any) {
    this.server.emit('truck-finalized', {
      timestamp: new Date(),
      data: truckData,
    });
    this.logger.log('Broadcast: truck-finalized');
  }

  /**
   * Broadcast para notificar que un camión ha sido cancelado
   */
  broadcastTruckCancelled(truckReceptionId: string) {
    this.server.emit('truck-cancelled', {
      timestamp: new Date(),
      truck_reception_id: truckReceptionId,
    });
    this.logger.log('Broadcast: truck-cancelled');
  }

  /**
   * Broadcast para notificar cambios de estado
   */
  broadcastStatusChange(truckReceptionId: string, newStatus: string) {
    this.server.emit('status-changed', {
      timestamp: new Date(),
      truck_reception_id: truckReceptionId,
      status: newStatus,
    });
    this.logger.log(`Broadcast: status-changed to ${newStatus}`);
  }

  /**
   * Obtener número de clientes conectados
   */
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Enviar notificación a un cliente específico
   */
  sendToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
    this.logger.log(`Message sent to client ${clientId}`);
  }

  /**
   * Broadcast a todos excepto al cliente que envía
   */
  broadcastToOthers(fromClientId: string, event: string, data: any) {
    this.server.emit(event, { ...data, timestamp: new Date() });
    this.logger.log(`Broadcast to others: ${event}`);
  }
}
