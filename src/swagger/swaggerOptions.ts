// src/swagger/swaggerOptions.ts
import { env } from '../config/env';

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
        url: `http://localhost:${env.PORT}/api`,
        description: '开发环境',
      },
      {
        url: 'https://your-domain.com/api',
        description: '生产环境',
      },
    ],
    /** ---- 统一复用对象 ---- */
    components: {
      /* 认证 */
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      /* 统一错误响应 schema */
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            status: { type: 'integer', example: 404 },
            code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
            message: { type: 'string', example: 'User friendly message' },
            requestId: { type: 'string', example: '2b764cdc-5c01-4a9a-b802-2a5d93f52d09' },
          },
          example: {
            timestamp: '2025-05-12T08:00:00Z',
            status: 404,
            code: 'RESOURCE_NOT_FOUND',
            message: 'User friendly message',
            requestId: '2b764cdc-5c01-4a9a-b802-2a5d93f52d09',
          },
        },
      },

      /* 复用响应体 */
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },

    /* 全局安全要求（可在具体路径里覆盖） */
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  /** 自动扫描注释的位置（globs 使用标准 Node/fast-glob 语法） */
  apis: ['./src/modules/**/routes.{ts,js}', './src/modules/**/**/*controller.{ts,js}'],
};
