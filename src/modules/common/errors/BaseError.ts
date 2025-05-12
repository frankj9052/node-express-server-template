import { StatusCodes } from 'http-status-codes';

export interface ErrorOptions {
  code: string; // 业务唯一 error-code
  status?: number; // http status
  message: string; // 对外（可 i18n）
  details?: unknown; // 内部调试
  cause?: Error; // es2022 cause
}

export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details: unknown;
  public readonly isOperational = true; // default，可被子类覆写
  public readonly timestamp = new Date().toISOString();

  constructor({
    code,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    message,
    details,
    cause,
  }: ErrorOptions) {
    super(message, { cause });
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      status: this.status,
      code: this.code,
      message: this.message,
      requestId: (this as any).requestId, // middleware 注入
    };
  }
}
