// /auth/service-login 颁发 JWT
// src/modules/service-auth/serviceAuth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ServiceTokenService } from './serviceToken.service';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';
import { getJWKS } from './jwks/jwks.service';

const serviceLoginSchema = z.object({
  serviceId: z.string(),
  serviceSecret: z.string(),
});

// 示例：服务认证信息可迁移至数据库
const mockServiceSecrets: Record<string, { secret: string; scopes: string[] }> = {
  'main-server': {
    secret: 'abc123',
    scopes: ['read:booking', 'write:booking'],
  },
  'billing-service': {
    secret: 'xyz456',
    scopes: ['read:billing'],
  },
};

export const serviceLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, serviceSecret } = serviceLoginSchema.parse(req.body);

    const entry = mockServiceSecrets[serviceId];
    if (!entry || entry.secret !== serviceSecret) {
      throw new UnauthorizedError('Invalid service credentials');
    }

    const token = await ServiceTokenService.signToken({
      serviceId,
      scopes: entry.scopes,
    });

    res.status(200).json({ status: 'success', data: { token } });
  } catch (error) {
    next(error);
  }
};

export const getJwksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwks = await getJWKS();
    res.status(200).json(jwks);
  } catch (err) {
    next(err);
  }
};
