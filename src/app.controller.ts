import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { Roles } from './common/decorators/roles.decorator';
import { Role } from './common/enums/role.enum';
import { RoleGuard } from './common/guards/role.guard';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Test API', description: 'This is a test api.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("hi")
  @ApiOperation({ summary: 'Test API', description: 'This is a test api.' })
  getHi(): string {
    return this.appService.getHello();
  }
}
