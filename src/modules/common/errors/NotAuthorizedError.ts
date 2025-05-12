// NotAuthorizedError.ts
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class NotAuthorizedError extends BaseError {
  constructor(action?: string, details?: unknown) {
    const extraDetails = action
      ? { action, ...(typeof details === 'object' && details !== null ? details : {}) }
      : details;
    super({
      code: 'NOT_AUTHORIZED',
      status: StatusCodes.FORBIDDEN, // 403 表示已认证但无权限
      message: action ? `Not authorized to ${action}` : 'Not authorized',
      details: extraDetails,
    });
  }
}
// throw new NotAuthorizedError('delete user', { userId: '123', role: 'viewer' });
