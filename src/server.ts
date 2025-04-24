import app from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';

async function startServer() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully.');

    app.listen(Number(env.PORT), () => {
      console.log(`🚀 Server running at http://localhost:${env.PORT}`);
      console.log(`📚 Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // 关键错误退出进程
  }
}

startServer();
