import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Socket>();

  constructor(

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const accessToken = client.handshake.auth.token || client.handshake.query.token;
      if (!accessToken) {
        throw new UnauthorizedException('No access token provided');
      }

      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('JWT_SECRET'),
        ignoreExpiration: true,
      });

      if (!payload ?.sub) {
        throw new BadRequestException('Invalid access token');
      }

      client.data.user = {
        id: payload.sub,
      };
      this.connectedClients.set(client.id, client);
      console.log(`Client connected: ${client.id}`);
    }
    catch (error) {
      console.log('❌ Invalid token:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  getSocketsByUserId(userId: string): Socket[] {
    const sockets: Socket[] = [];
    for (const socket of this.connectedClients.values()) {
      if (socket.data?.user?.id === userId) {
        sockets.push(socket);
      }
    }
    return sockets;
  }

  sendToUser(userId: string, event: string, payload: any) {
    const sockets = this.getSocketsByUserId(userId);
    sockets.forEach((socket) => {
      socket.emit(event, payload);
    });
  }

  sendToUsers(userIds: string[], event: string, payload: any) {
    userIds.forEach((id) => this.sendToUser(id, event, payload));
  }

  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }


  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: any): void {
    console.log('Message received:', data);
    // Gửi lại cho tất cả client khác
    this.server.emit('messageReceived', data);
  }
}
