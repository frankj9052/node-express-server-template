import 'reflect-metadata';
import express, { Router } from 'express';
import cors from 'cors';
import { swaggerDocs } from './swagger/swagger';
import { corsOptions } from './config/corsOptions';
import cookieParser from 'cookie-parser';
import { registerRoutes } from './loaders/registerRoutes';
// import { sessionMiddleware } from './middlewares/sessionMiddleware';

const app = express();

app.set('trust proxy', true);
app.disable('x-powered-by');

// 中间件
app.use(cookieParser());
// app.use(sessionMiddleware);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Swagger 文档
app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);

const apiRouter = Router();
await registerRoutes(apiRouter);
app.use('/api', apiRouter);

export default app;
