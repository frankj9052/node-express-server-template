import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  constructor(errors: Record<string, string>) {
    super({
      code: 'VALIDATION_FAILED',
      status: StatusCodes.BAD_REQUEST,
      message: 'Validation failed',
      details: errors,
    });
  }
}
