import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../../models/auth/dto/sign-up.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { randomBytes } from 'crypto';
import { RefreshTokenDto } from '../../models/auth/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generateToken(user: {
    id: string;
    username: string;
    firstName: string;
    email: string;
  }) {
    try {
      const payload = {
        sub: user.id,
        username: user.username,
        firstName: user.firstName,
        email: user.email,
      };
      const jwtExpireMinutes = Number( this.config.get<string>('JWT_EXPIRES_IN') || 120);
      const expiresInSeconds = jwtExpireMinutes * 60;

      const refreshTokenIn = Number( this.config.get<string>('REFRESH_EXPIRES_IN') || 7);
      const expireStart = new Date();
      const expireAt = new Date(Date.now() + refreshTokenIn * 24 * 60 * 60 * 1000);

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: expiresInSeconds,
        issuer: this.config.get<string>('JWT_ISSUER'),
        audience: this.config.get<string>('JWT_AUDIENCE'),
        secret: this.config.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
      });

      const refreshTokenRecord = this.refreshTokenRepo.create({
        refreshToken: randomBytes(64).toString('hex'),
        accessToken: accessToken,
        userId: user.id,
        expiryTime: expireAt,
        addedDate: expireStart,
        isUsed: false,
        IsRevoked: false,
      });
      const { refreshToken } = await this.refreshTokenRepo.save(refreshTokenRecord);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signIn(username: string, password: string) {
    try {
      if (!username || !password) {
        throw new BadRequestException('Username and password are required');
      }

      const userCheck = await this.userRepo.findOne({
        where: { username: ILike(username) },
      });
      if (!userCheck) {
        throw new BadRequestException('Invalid username or password');
      }

      if (!userCheck.isActive) {
        throw new BadRequestException('User account is disabled');
      }

      const passwordMatch = await bcrypt.compare(password, userCheck.password);
      if (!passwordMatch) {
        throw new BadRequestException('Invalid username or password');
      }

      const user = {
        id: userCheck.id,
        username: userCheck.username,
        firstName: userCheck.firstName,
        email: userCheck.email,
      };

      const {accessToken, refreshToken} = await this.generateToken(user);
      userCheck.lastLogin = new Date();
      await this.userRepo.save(userCheck);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signUp(dto: SignUpDto) {
    try {
      const { email, firstName, lastName, username, password } = dto;
      if (!email || !password || !username || !firstName)
        throw new BadRequestException('Missing required fields');

      const existingUserByUsername = await this.userRepo.findOne({
        where: { username: ILike(username) },
      });
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }

      const existingUserByEmail = await this.userRepo.findOne({
        where: { email: ILike(email) },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashed,
        firstName: firstName.toLowerCase(),
        lastName: lastName && lastName.toLowerCase(),
      });

      return await this.userRepo.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const { accessToken, refreshToken } = dto;
      if (!accessToken || !refreshToken)
        throw new BadRequestException('Missing required fields');

      // const decoded = this.jwtService.decode(accessToken) as any;
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get<string>('JWT_SECRET'),
        ignoreExpiration: true,
      });

      if (!decoded?.sub) {
        throw new BadRequestException('Invalid access token');
      }

      const userId = decoded.sub;
      const storedToken = await this.refreshTokenRepo.findOne({
        where: { refreshToken, userId, accessToken },
      });

      if (!storedToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      if (storedToken.isUsed) {
        throw new BadRequestException('Refresh token already used');
      }

      if (storedToken.IsRevoked) {
        throw new BadRequestException('Refresh token revoked');
      }

      const now = new Date();
      if (storedToken.expiryTime < now) {
        throw new BadRequestException('Refresh token expired');
      }
      storedToken.isUsed = true;
      storedToken.IsRevoked = true;
      await this.refreshTokenRepo.save(storedToken);

      return await this.generateToken({
        id: decoded.sub,
        username: decoded.username,
        firstName: decoded.firstName,
        email: decoded.email,
      })

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
