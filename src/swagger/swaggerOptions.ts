import { env } from '../config/env';

// src/swagger/swaggerOptions.ts
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NoqClinic API 文档',
      version: '1.0.0',
      description: '这是用于内部和第三方的后端服务接口文档',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/v1`,
        description: '开发环境 - v1',
      },
      {
        url: 'https://your-domain.com/v1',
        description: '生产环境 - v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // 自动从这些文件读取注释
};
