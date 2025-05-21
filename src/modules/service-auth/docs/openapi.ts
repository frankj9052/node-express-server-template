import { registry } from '@/config/openapiRegistry';
import { z } from 'zod';

// ✅ Schema: service-login 请求体
const serviceLoginSchema = z.object({
  serviceId: z.string().openapi({ example: 'main-server' }),
  serviceSecret: z.string().openapi({ example: 'abc123' }),
});

// ✅ Schema: service-login 成功响应
const serviceLoginResponseSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    token: z.string().describe('JWT access token (RS256 signed)'),
  }),
});

// ✅ 注册 /auth/service-login 路由文档
registry.registerPath({
  method: 'post',
  path: '/auth/service-login',
  tags: ['Service Auth'],
  summary: '服务登录：获取 JWT access token',
  request: {
    body: {
      description: 'Service ID 与其 Secret',
      required: true,
      content: {
        'application/json': {
          schema: serviceLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '登录成功，返回 JWT token',
      content: {
        'application/json': {
          schema: serviceLoginResponseSchema,
        },
      },
    },
    401: {
      description: '认证失败（serviceId 或 secret 错误）',
    },
  },
});

// ✅ 注册 /.well-known/jwks.json 路由文档（通用）
registry.registerPath({
  method: 'get',
  path: '/.well-known/jwks.json',
  tags: ['Service Auth'],
  summary: 'JWKS 公钥列表：用于服务验证 RS256 JWT',
  responses: {
    200: {
      description: '符合 RFC7517 的公钥 JSON 列表',
      content: {
        'application/json': {
          schema: z.object({
            keys: z.array(
              z.object({
                kty: z.string(),
                use: z.string().optional(),
                kid: z.string().optional(),
                alg: z.string().optional(),
                n: z.string(),
                e: z.string(),
              })
            ),
          }),
        },
      },
    },
  },
});
