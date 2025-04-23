// src/swagger/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swaggerOptions';

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerDocs = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};
