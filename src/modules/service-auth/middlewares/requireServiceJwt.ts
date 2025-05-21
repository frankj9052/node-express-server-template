// src/modules/service-auth/middlewares/requireServiceJwt.ts
import { Request, Response, NextFunction } from 'express';
import { verifyServiceJwt } from '../utils/verifyWithJwks';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';
import { createLoggerWithContext } from '@modules/common/lib/logger';

const logger = createLoggerWithContext('requireServiceJwt');

export const requireServiceJwt = (requiredScopes: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Missing Bearer token'));
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      const payload = await verifyServiceJwt(token, 'booking-service'); // <== 子服务标识

      const missing = requiredScopes.filter(scope => !payload.scopes.includes(scope));
      if (missing.length > 0) {
        return next(new UnauthorizedError(`Missing scopes: ${missing.join(', ')}`));
      }

      req.serviceAuth = {
        serviceId: payload.serviceId,
        scopes: payload.scopes,
      };

      next();
    } catch (error) {
      logger.error('JWT error during verification', error);
      return next(new UnauthorizedError('Invalid or expired service token'));
    }
  };
};
