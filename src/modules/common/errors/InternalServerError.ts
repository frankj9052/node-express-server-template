import { BaseError } from './BaseError';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export class InternalServerError extends BaseError {
  constructor(message?: string, details?: unknown) {
    super({
      code: 'INTERNAL_SERVER_ERROR',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR), // 默认是 "Internal Server Error"
      details,
    });
  }
}
