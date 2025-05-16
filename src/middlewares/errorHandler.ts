import { BaseError } from '@modules/common/errors/BaseError';
import { InternalServerError } from '@modules/common/errors/InternalServerError';
import { env } from 'config/env';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { logger } from '@modules/common/lib/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Debug：避免重复实例问题
  // if (env.NODE_ENV === 'development') {
  //   console.error('[DEBUG] error instanceof BaseError:', err instanceof BaseError);
  //   console.error('[DEBUG] err.constructor.name:', err.constructor.name);
  // }

  // 1. 统一封装
  const appError =
    err instanceof BaseError
      ? err
      : new InternalServerError(env.NODE_ENV === 'development' ? err.stack : undefined, err);

  // 2. 注入 requestId
  (appError as any).requestId = req.requestId;

  // 3. 日志
  logger.error(appError);

  // 4. sentry（只上报严重 & 非开发环境）
  if (env.NODE_ENV === 'production' && appError.status >= 500) {
    Sentry.captureException(err, {
      extra: { requestId: req.requestId },
    });
  }

  // 5. 响应
  res.status(appError.status).json(appError.toJSON());
};
