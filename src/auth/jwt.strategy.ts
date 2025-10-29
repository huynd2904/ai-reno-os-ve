import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || '',
      issuer: config.get<string>('JWT_ISSUER') || '',
      audience: config.get<string>('JWT_AUDIENCE') || '',
    });
  }

  async validate(payload: any) {
    if (
      !payload.sub ||
      !payload.username ||
      !payload.firstName ||
      !payload.email
    ) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: payload.sub,
      firstName: payload.firstName,
      username: payload.username,
      email: payload.email,
    };
  }
}
