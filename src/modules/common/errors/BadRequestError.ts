import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';
// throw new BadRequestError('Missing required field: email', { field: 'email' });
export class BadRequestError extends BaseError {
  constructor(message = 'Bad request', details?: unknown) {
    super({
      code: 'BAD_REQUEST',
      status: StatusCodes.BAD_REQUEST,
      message,
      details,
    });
  }
}
