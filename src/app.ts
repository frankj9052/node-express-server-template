import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { swaggerDocs } from './swagger/swagger';
import { corsOptions } from './config/corsOptions';

const app = express();

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Swagger 文档
app.use('/api-docs', swaggerDocs.serve, swaggerDocs.setup);
app.use('/api', routes);

export default app;
