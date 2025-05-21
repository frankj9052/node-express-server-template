// 各服务验证 JWT 的中间件
// src/modules/service-auth/middlewares/requireServiceAuth.ts
import { Request, Response, NextFunction } from 'express';
import { ServiceTokenService } from '../serviceToken.service';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';

export const requireServiceAuth = (requiredScopes: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing Bearer token'));
    }

    const token = authHeader.replace('Bearer ', '').trim();

    let payload;
    try {
      payload = await ServiceTokenService.verifyToken(token);
    } catch (err) {
      return next(err);
    }

    // 验证 scopes
    const missing = requiredScopes.filter(scope => !payload.scopes.includes(scope));
    if (missing.length > 0) {
      return next(new UnauthorizedError(`Missing required scopes: ${missing.join(', ')}`));
    }

    // 注入到 req
    req.serviceAuth = {
      serviceId: payload.serviceId,
      scopes: payload.scopes,
    };

    next();
  };
};
