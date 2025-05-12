import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(resource = 'Resource') {
    super({
      code: 'RESOURCE_NOT_FOUND',
      status: StatusCodes.NOT_FOUND,
      message: `${resource} not found`,
    });
  }
}
