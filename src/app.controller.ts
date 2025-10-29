import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RealtimeService } from './realtime/realtime.service';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Test API', description: 'This is a test api.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
