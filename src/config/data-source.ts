import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { env } from './env';
import { getCurrentDirname } from '../utils/path';

const __dirname = getCurrentDirname(import.meta.url);
const isProduction = env.NODE_ENV === 'production';

// 支持两种数据库配置方式：DATABASE_URL（推荐用于 SaaS，如 Neon） 或 字段式（适合本地、自建服务）
const connectionOptions = env.DATABASE_URL
  ? {
      url: env.DATABASE_URL,
      ssl: true, // SaaS like Neon typically requires SSL
    }
  : {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    };

const options = {
  type: 'postgres',
  ...connectionOptions,
  synchronize: false, // 永远不要在生产中使用 true！
  logging: isProduction ? ['error'] : ['query', 'error'],
  maxQueryExecutionTime: 3000, // 慢查询记录阈值（毫秒）

  // 匹配 .ts/.js 实体和迁移文件（兼容编译产物）
  entities: [path.resolve(__dirname, '../database/entities/**/*.{ts,js}')],
  migrations: [path.resolve(__dirname, '../database/migrations/**/*.{ts,js}')],
  // 连接池优化（pg-pool 参数）
  extra: {
    max: 50, // 最大连接数
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  // 🧩 新增 Seeder 配置（只影响 typeorm-extension，不影响普通 TypeORM）
  seeds: [path.resolve(__dirname, '../database/seeds/**/*{.ts,.js}')],
  factories: [path.resolve(__dirname, '../database/factories/**/*{.ts,.js}')],
};
// 实例化 TypeORM 数据源
export const AppDataSource = new DataSource(options as any);
