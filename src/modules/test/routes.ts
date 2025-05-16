// src/modules/test/routes.ts
import { Router } from 'express';
import { connectionTest } from './test.controller';
import { registry } from 'config/openapiRegistry';
import { z } from 'zod';

const router = Router();

// ✅ 注册 API 文档（使用 OpenAPIRegistry）
registry.registerPath({
  method: 'get',
  path: '/test',
  tags: ['Test'],
  summary: '测试 API 是否存活',
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('ok'),
          }),
        },
      },
    },
  },
});

// ✅ 路由实现
router.get('/test', connectionTest);

export function register(parent: Router) {
  parent.use('/', router);
}
