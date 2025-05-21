// src/modules/auth/middlewares/requireAuth.ts
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';
import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }

  next();
};
