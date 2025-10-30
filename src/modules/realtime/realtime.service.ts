import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  async sendPrivateMessage(userId: string, message: string) {
    this.gateway.sendToUser(userId, 'privateMessage', { message });
  }

  async sendBulkNotification(userIds: string[], content: string) {
    this.gateway.sendToUsers(userIds, 'notification', { content });
  }

  async broadcastSystemMessage(content: string) {
    this.gateway.broadcast('systemMessage', { content });
  }
}
