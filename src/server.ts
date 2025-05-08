import AppDataSource from 'config/data-source';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './infrastructure/database';
import { closeRedisConnection, connectRedis, redisClient } from './infrastructure/redis';
import { sessionMiddleware } from './middlewares/sessionMiddleware';

import { Server } from 'http';

let server: Server;

/** 服务启动入口（所有异步 await 都集中在这里） */
async function startServer() {
  try {
    console.log('🚀 Starting server...');

    // 1. 初始化数据库（含种子）
    await connectDatabase({
      dataSource: AppDataSource,
      enableSeeders: env.ENABLE_SEEDERS === 'true',
      skipCreateDatabase: true,
    });

    // 2. 初始化 Redis
    await connectRedis();

    // 3. 创建并配置 Express 应用
    const app = await createApp(); // ← **等待路由全部挂载**
    app.use(sessionMiddleware); // Redis 就绪后再挂 session

    // 4. 启动 HTTP 服务器
    server = app.listen(Number(env.PORT), () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
      console.log(`📚 Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });

    /* -------- 全局异常与信号处理 -------- */
    process.on('unhandledRejection', reason => {
      console.error('❗ Unhandled Rejection:', reason);
      shutdown(1);
    });

    process.on('uncaughtException', error => {
      console.error('❗ Uncaught Exception:', error);
      shutdown(1);
    });

    process.on('SIGINT', () => shutdown(0));
    process.on('SIGTERM', () => shutdown(0));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/** 优雅关闭 */
async function shutdown(exitCode: number) {
  console.log('🧹 Shutting down server...');

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
      console.log('🛑 HTTP server closed.');
    }
    if (redisClient) {
      await closeRedisConnection();
    }
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🛑 Database connection closed.');
    }
  } catch (error) {
    console.error('❗ Error during shutdown:', error);
  } finally {
    process.exit(exitCode);
  }
}

startServer();
