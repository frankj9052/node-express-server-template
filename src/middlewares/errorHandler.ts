import { BaseError } from '@modules/common/errors/BaseError';
import { InternalServerError } from '@modules/common/errors/InternalServerError';
import { env } from 'config/env';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { logger } from '@modules/common/lib/logger';
import { UnauthorizedError } from '@modules/common/errors/UnauthorizedError';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // 1. 统一错误封装
  const appError =
    err instanceof BaseError
      ? err
      : new InternalServerError(env.NODE_ENV === 'development' ? err.stack : undefined, err);

  // 2. 注入 requestId（便于日志和链路追踪）
  (appError as any).requestId = req.requestId;

  // 3. 自动清理会话：如果是 UnauthorizedError 则销毁 session（防止滥用）
  if (appError instanceof UnauthorizedError && req.session) {
    req.session.destroy(() => {
      logger.debug('Session destroyed due to unauthorized access');
    });
  }

  // 4. 日志输出（结构化）
  logger.error('Unhandled application error', {
    name: appError.name,
    message: appError.message,
    requestId: req.requestId,
    stack: appError.stack,
    status: appError.status,
    cause: (appError as any).cause || undefined,
    path: req.path,
    method: req.method,
    user: (req.currentUser && req.currentUser.id) || undefined,
  });

  // 5. sentry 报错（仅限严重错误 && 生产环境）
  if (env.NODE_ENV === 'production' && appError.status >= 500) {
    Sentry.captureException(err, {
      tags: {
        requestId: req.requestId,
        path: req.path,
        userId: req.currentUser?.id,
      },
      extra: {
        stack: appError.stack,
        userAgent: req.headers['user-agent'],
        session: req.session,
      },
    });
  }

  // 6. 客户端响应（非生产环境返回更多信息）
  const responsePayload = {
    status: 'error',
    message: appError.message,
    ...(env.NODE_ENV !== 'production' && {
      name: appError.name,
      requestId: req.requestId,
      stack: appError.stack,
      cause: (appError as any).cause,
    }),
  };

  // 7. 响应
  res.status(appError.status).json(responsePayload);
};
