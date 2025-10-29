import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { JwtService } from '@nestjs/jwt';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [User, RefreshToken], //Entity
          synchronize: false,
          logging: true,
        };
      },
    }),
    AuthModule,
    UserModule,
    RefreshTokenModule,
    RealtimeModule
  ],
  controllers: [AppController],
  providers: [AppService,RealtimeGateway, JwtService],
})
export class AppModule {}
