import { DataSource } from 'typeorm';
import { User } from '../entities/user';
import { APP_CONFIG } from './constant';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: APP_CONFIG.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
});
