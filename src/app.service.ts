import { Injectable } from '@nestjs/common';
import { RealtimeService } from './modules/realtime/realtime.service';

@Injectable()
export class AppService {

  constructor(
    private readonly realtimeService: RealtimeService
  ) { }
  getHello(): string {
    this.realtimeService.broadcastSystemMessage("Hello World!")
    return 'Hello World!';
  }
}
