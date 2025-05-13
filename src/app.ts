import 'reflect-metadata';
import express, { Router } from 'express';
import cors from 'cors';
import { swaggerDocs } from './swagger/swagger';
import { corsOptions } from './config/corsOptions';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './loaders/registerRoutes';
import { requestId } from 'middlewares/requestId';
import { errorHandler } from 'middlewares/errorHandler';

/**
 * 异步创建并配置 Express Application
 */
export async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // ---- 全局中间件 ----
  app.use(cookieParser());
  // app.use(sessionMiddleware);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- Swagger ----
  app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);

  // 其它中间件
  app.use(requestId);

  // ---- 动态注册业务路由（异步操作）----
  const apiRouter = Router();
  await registerRoutes(apiRouter);
  app.use('/api', apiRouter);

  // ---- 全局错误处理器 ----
  app.use(errorHandler);

  return app;
}

export default createApp;
