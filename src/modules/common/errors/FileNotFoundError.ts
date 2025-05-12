// FileNotFoundError.ts
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class FileNotFoundError extends BaseError {
  constructor(filePath?: string) {
    super({
      code: 'FILE_NOT_FOUND',
      status: StatusCodes.NOT_FOUND,
      message: filePath ? `File not found: ${filePath}` : 'File not found',
      details: filePath ? { path: filePath } : undefined,
    });
  }
}

// throw new FileNotFoundError('/uploads/image.png');
