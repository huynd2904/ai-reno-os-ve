import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/user.entity';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { RefreshToken } from './modules/refresh-token/refresh-token.entity';
import { RealtimeGateway } from './modules/realtime/realtime.gateway';
import { JwtService } from '@nestjs/jwt';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { RoleGuard } from './common/guards/role.guard';

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
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService,RealtimeGateway, JwtService, RoleGuard],
})
export class AppModule {}
