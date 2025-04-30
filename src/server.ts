import app from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { connectDatabase } from './infrastructure/database';
import { connectRedis, redisClient } from './infrastructure/redis';
import { sessionMiddleware } from './middlewares/sessionMiddleware';

import { Server } from 'http';

let server: Server;

async function startServer() {
  try {
    console.log('🚀 Starting server...');

    await connectDatabase({ dataSource: AppDataSource });
    await connectRedis();

    // Redis连上了再use sessionMiddleware
    app.use(sessionMiddleware);

    server = app.listen(Number(env.PORT), () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
      console.log(`📚 Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });

    // 捕获全局未处理Promise异常
    process.on('unhandledRejection', reason => {
      console.error('❗ Unhandled Rejection:', reason);
      shutdown(1);
    });

    // 捕获全局未处理Exception异常
    process.on('uncaughtException', error => {
      console.error('❗ Uncaught Exception:', error);
      shutdown(1);
    });

    // 捕获 SIGINT (Ctrl+C) 或 SIGTERM (容器停止)
    process.on('SIGINT', () => shutdown(0));
    process.on('SIGTERM', () => shutdown(0));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown(exitCode: number) {
  console.log('🧹 Shutting down server...');

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => {
          if (err) return reject(err);
          resolve();
        });
      });
      console.log('🛑 HTTP server closed.');
    }

    if (redisClient) {
      await redisClient.quit();
      console.log('🛑 Redis client disconnected.');
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
