import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { env } from './env';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getCurrentDirname } from '@modules/common/utils/path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

type ExtendedOptions = DataSourceOptions & {
  seeds?: string[];
  factories?: string[];
};

const toPosix = (p: string) => p.replace(/\\/g, '/');
const __dirname = getCurrentDirname(import.meta.url);
const isProd = env.NODE_ENV === 'production';
const rootDir = path.resolve(__dirname, '../..');

// 日志检查 rootDir 正确性
const cloudUrlOptions = env.DATABASE_URL
  ? {
      url: env.DATABASE_URL,
      ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      ssl: env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

console.log('路径检查===> ', path.join(rootDir, 'src/modules/**/entities/*.{ts,js}'));
const baseOptions = {
  type: 'postgres',
  synchronize: false,
  logging: isProd ? ['error'] : ['query', 'error'],
  maxQueryExecutionTime: 3000,
  namingStrategy: new SnakeNamingStrategy(),

  entities: [
    toPosix(
      isProd
        ? path.join(rootDir, 'dist/modules/**/entities/*.js')
        : path.join(rootDir, 'src/modules/**/entities/*.{ts,js}')
    ),
  ],
  migrations: [
    toPosix(
      isProd
        ? path.join(rootDir, 'dist/migrations/*.js')
        : path.join(rootDir, 'src/migrations/*.{ts,js}')
    ),
  ],

  extra: {
    max: env.PG_POOL_MAX,
    idleTimeoutMillis: env.PG_IDLE_MS,
    connectionTimeoutMillis: env.PG_CONN_TIMEOUT_MS,
  },
};

const dataSourceOptions: ExtendedOptions = {
  ...(baseOptions as PostgresConnectionOptions),
  ...(cloudUrlOptions as PostgresConnectionOptions),
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
