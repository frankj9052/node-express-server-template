import app from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { connectDatabase } from './utils/connectDatabase';

async function startServer() {
  try {
    console.log('🚀 Starting server...');

    await connectDatabase({
      dataSource: AppDataSource,
    });

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
