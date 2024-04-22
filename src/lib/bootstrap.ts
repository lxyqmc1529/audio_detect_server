import { DB } from '@app/config';
import { DataSource } from 'typeorm';
import { User, Audio } from '@app/models';
import 'reflect-metadata';

// 初始化数据库
export const AppDataSource = new DataSource({
  type: DB.type as any,
  host: DB.host,
  port: DB.port,
  username: DB.username,
  password: DB.password,
  database: DB.database,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Audio,
  ],
});

export async function bootstrap() {
  await AppDataSource.initialize();
}

