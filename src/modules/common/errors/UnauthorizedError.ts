// UnauthorizedError.ts
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class UnauthorizedError extends BaseError {
  constructor(details?: unknown) {
    super({
      code: 'UNAUTHORIZED',
      status: StatusCodes.UNAUTHORIZED, // 401 表示未认证
      message: 'Authentication required',
      details,
    });
  }
}
// 这个用于「未登录」而不是「权限不足」的情形
