import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../../models/auth/dto/login.dto';
import { SignUpDto } from '../../models/auth/dto/sign-up.dto';
import { RefreshTokenDto } from '../../models/auth/dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'User login (returns JWT)' })
  @ApiResponse({ status: 200, description: 'JWT Token returned' })
  async signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.username, dto.password);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Register new User' })
  @ApiResponse({ status: 200})
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({ status: 200})
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }
}
