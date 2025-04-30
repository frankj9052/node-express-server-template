import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { env } from './env';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getCurrentDirname } from '@modules/common/utils/path';

/** __dirname in ESM */
const __dirname = getCurrentDirname(import.meta.url);
const isProd = env.NODE_ENV === 'production';

// 支持两种数据库配置方式：DATABASE_URL（推荐用于 SaaS，如 Neon） 或 字段式（适合本地、自建服务）
const cloudUrlOptions = env.DATABASE_URL
  ? {
      url: env.DATABASE_URL,
      ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false, // SaaS like Neon typically requires SSL
    }
  : {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl:
        env.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
    };

const baseOptions = {
  type: 'postgres',
  synchronize: false, // 永远不要在生产中使用 true！
  logging: isProd ? ['error'] : ['query', 'error'],
  maxQueryExecutionTime: 3000, // 慢查询记录阈值（毫秒）
  namingStrategy: new SnakeNamingStrategy(),

  // 匹配 .ts/.js 实体和迁移文件（兼容编译产物）
  entities: [path.resolve(__dirname, 'src/modules/**/entities/*.{ts,js}')],
  migrations: [path.resolve(__dirname, 'src/modules/**/migrations/*.{ts,js}')],
  // 🧩 新增 Seeder 配置（只影响 typeorm-extension，不影响普通 TypeORM）
  seeds: [
    path.resolve(
      __dirname,
      isProd
        ? '../modules/**/seeds/*-prod.seed.{ts,js}' // 只跑带 -prod.seed 的脚本
        : '../modules/**/seeds/*.{ts,js}' // 开发环境跑全部
    ),
  ],
  factories: [path.resolve(__dirname, 'src/modules/**/factories/*{.ts,.js}')],
  // 连接池优化（pg-pool 参数）
  extra: {
    max: env.PG_POOL_MAX, // 最大连接数
    idleTimeoutMillis: env.PG_IDLE_MS,
    connectionTimeoutMillis: env.PG_CONN_TIMEOUT_MS,
  },
} as const;

// 实例化 TypeORM 数据源
export const AppDataSource = new DataSource({
  ...baseOptions,
  ...cloudUrlOptions,
} as any);
