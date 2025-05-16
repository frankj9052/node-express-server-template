// Winston 配置
import { env } from 'config/env';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import os from 'os';
import path from 'path';
import * as Sentry from '@sentry/node';

/* ────────────────────────────────────────────────────────────────────────────
 * 1. Sentry 初始化（仅在生产 & 配置了 DSN 时启用）
 * ────────────────────────────────────────────────────────────────────────── */
if (env.NODE_ENV === 'production' && env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0, // 如果需要 APM 请调高；这里只做 error 汇报
    release: `noqclinic@${env.APP_VERSION ?? 'dev'}`,
    enabled: env.NODE_ENV === 'production',
  });
}
/* ────────────────────────────────────────────────────────────────────────────
 * 2. 公共配置
 * ────────────────────────────────────────────────────────────────────────── */
const LOG_LEVEL = env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug');

const defaultMeta = {
  service: 'noqclinic-api',
  hostname: os.hostname(),
  pid: process.pid,
};

/** ---------------------------------------------------------------------------
 * 3. Console Transport
 *    开发环境彩色可读，生产环境保持 JSON 结构化（方便 stdout 收集）
 * ------------------------------------------------------------------------- */
const consoleTransport = new winston.transports.Console({
  level: LOG_LEVEL,
  handleExceptions: true,
  format:
    env.NODE_ENV === 'production'
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.printf(({ timestamp, level, message, stack, context, ...meta }) =>
            [
              `${timestamp} [${level}]${context ? ` [${context}]` : ''}`,
              stack ?? message,
              Object.keys(meta).length ? JSON.stringify(meta) : '',
            ]
              .filter(Boolean)
              .join(' | ')
          )
        ),
});

/** ---------------------------------------------------------------------------
 * 4. File Transport（仅本地或需要持久化日志时启用）
 * ------------------------------------------------------------------------- */
const fileTransport =
  env.NODE_ENV === 'production' && env.LOG_TO_FILE !== 'true'
    ? null
    : new DailyRotateFile({
        dirname: path.resolve(process.cwd(), 'logs'),
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '30d',
        maxSize: '20m',
        zippedArchive: true,
        level: LOG_LEVEL,
        handleExceptions: true,
        handleRejections: true,
      });

/* ────────────────────────────────────────────────────────────────────────────
 * 5. Sentry Transport（自定义；不产生多余输出）
 *    - 对 error 级别以上事件做 captureException
 * ────────────────────────────────────────────────────────────────────────── */
const sentryTransport =
  env.NODE_ENV === 'production' && env.SENTRY_DSN
    ? new winston.transports.Console({
        level: 'error',
        handleExceptions: true,
        format: winston.format(info => {
          // 1) 把 info 转成 Error 实例（保持堆栈）
          let err: Error;

          if (info instanceof Error) {
            err = info;
          } else if (info.stack && typeof info.stack === 'string') {
            // 手动创建 + 重新挂 stack，确保 TS 类型安全
            err = new Error(typeof info.message === 'string' ? info.message : 'Captured error');
            err.stack = info.stack;
          } else {
            err = new Error(typeof info.message === 'string' ? info.message : JSON.stringify(info));
          }

          // 2) 推送到 Sentry，带完整 extra
          Sentry.captureException(err, { extra: info });

          // 3) 返回 false ⇒ Winston 不再输出该条日志
          return false;
        })(),
      })
    : null;

/* ────────────────────────────────────────────────────────────────────────────
 * 6. 创建 Logger 实例（带类型提示）
 * ────────────────────────────────────────────────────────────────────────── */
export const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta,
  transports: [
    consoleTransport,
    ...(fileTransport ? [fileTransport] : []),
    ...(sentryTransport ? [sentryTransport] : []),
  ],
  exitOnError: false, // 优雅关机交由 process.on() 处理
});

/* ────────────────────────────────────────────────────────────────────────────
 * 7. 类型安全的子 logger 工具函数（带提示）
 * ────────────────────────────────────────────────────────────────────────── */
type CustomLogMeta = {
  context?: string;
  requestId?: string;
  userId?: string;
};

/** 用于模块内 context 标记 */
export const createLoggerWithContext = (context: string) =>
  logger.child({ context } as CustomLogMeta);

/* ────────────────────────────────────────────────────────────────────────────
 * 8. 基于 requestId / userId 的子 logger（如挂载到 req.logger）
 * ────────────────────────────────────────────────────────────────────────── */
export const getRequestLogger = (requestId: string, userId?: string) =>
  logger.child({ requestId, userId });
