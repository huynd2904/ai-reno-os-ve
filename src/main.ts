import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { runSeed } from './database/seed';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global interceptors and filters for API
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());

  // CORS setup
  const allowedOrigins = config.get<string>('ALLOWED_ORIGINS')?.split(',')
    .map((origin) => origin.trim());
  app.enableCors({
    origin: (origin, callback)=> {
      if (!origin) {
        return callback(null, true);
      }

      if (!allowedOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // SwaggerUI setup
  const documentConfig = new DocumentBuilder()
    .setTitle('AiRenoOS Engine')
    .setDescription('AiRenoOS API')
    .setVersion('1.0')
    .addTag('AiRenoOS')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await runSeed();
  await app.listen(config.get<number>('PORT') ?? 5000);
  console.log(`🚀 AiRenoOS Engine is running on: ${config.get<string>('JWT_AUDIENCE')}/api`);
}
bootstrap();
