// src/modules/auth/routes.ts
import { Router } from 'express';
import { currentUserController, loginController } from './auth.controller';
import { validateRequest } from '@modules/common/middlewares/validateRequest';
import { loginSchema } from './dto/login.dto';
import { registry } from 'config/openapiRegistry';
import { z } from 'zod';
import { requireAuth } from './middlewares/requireAuth';

const router = Router();

// ✅ 注册 API 文档路径信息（OpenAPI Path）
registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: '用户登录',
  request: {
    body: {
      description: '登录所需的 email 和 password',
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '登录成功',
      content: {
        'application/json': {
          schema: z.object({
            status: z.literal('success'),
            data: z.object({
              id: z.string(),
              email: z.string().email(),
              userName: z.string(),
            }),
          }),
        },
      },
    },
    401: {
      description: '认证失败',
    },
    422: {
      description: '验证失败',
    },
  },
});
router.post('/auth/login', validateRequest({ body: loginSchema }), loginController);
router.get('/auth/current-user', requireAuth, currentUserController);

export function register(parent: Router) {
  parent.use('/', router);
}
