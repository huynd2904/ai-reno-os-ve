import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

import * as dotenv from 'dotenv';
import { User } from './user/user.entity';
import { RefreshToken } from './refresh-token/refresh-token.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mydb',
  entities: [User, RefreshToken],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true,
});
