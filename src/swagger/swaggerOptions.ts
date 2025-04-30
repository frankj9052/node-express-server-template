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
        url: `http://localhost:${env.PORT}/`,
        description: '开发环境',
      },
      {
        url: 'https://your-domain.com/',
        description: '生产环境',
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
  apis: [
    './src/modules/**/routes.{ts,js}',
    './src/modules/**/**/*controller.{ts,js}', // 如果你把 swagger 注释放在 controller
  ], // 自动从这些文件读取注释
};
