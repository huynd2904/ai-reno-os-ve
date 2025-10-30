import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

import * as dotenv from 'dotenv';
import { User } from './modules/user/user.entity';
import { RefreshToken } from './modules/refresh-token/refresh-token.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  entities: [User, RefreshToken],
  migrations: [join(__dirname, '/database/migrations/*.{ts,js}')], //path to migration files
  synchronize: false,
  logging: true,
});
