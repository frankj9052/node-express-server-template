import { BaseError } from '@modules/common/errors/BaseError';
import { InternalServerError } from '@modules/common/errors/InternalServerError';
import { logger } from '@sentry/core';
import { env } from 'config/env';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
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
