import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    // namespace: '/notifications',
    path: '/ws', cors: true, // General namespace for various notifications
  })
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    handleConnection(client: any) {
      console.log('Client connected:', client.id);
    }
  
    handleDisconnect(client: any) {
      console.log('Client disconnected:', client.id);
    }
  
    // Generic method to emit any type of event with a payload
    emitEvent(eventName: string, payload: any) {
      this.server.emit(eventName, payload); // Emit to all clients on the namespace
    }
  }
  