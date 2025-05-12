import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class InvocationError extends BaseError {
  constructor(methodName?: string, details?: unknown) {
    const extraDetails = methodName
      ? { method: methodName, ...(typeof details === 'object' && details !== null ? details : {}) }
      : details;

    super({
      code: 'INVOCATION_ERROR',
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: methodName ? `Invocation failed: ${methodName}` : 'Invocation failed',
      details: extraDetails,
    });
  }
}

// throw new InvocationError('generateInvoice', { input: invoiceData, cause: 'Invalid format' });
