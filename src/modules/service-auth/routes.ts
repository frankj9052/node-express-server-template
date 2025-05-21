// 注册所有 service-auth 路由
// src/modules/service-auth/routes.ts
import { Router } from 'express';
import { getJwksController, serviceLoginController } from './serviceAuth.controller';
import './docs/openapi';

const router = Router();

router.post('/auth/service-login', serviceLoginController);
router.get('/.well-known/jwks.json', getJwksController); // ✅ 业界标准路径

export function register(parent: Router) {
  parent.use('/', router);
}
