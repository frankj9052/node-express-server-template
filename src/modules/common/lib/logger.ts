// Winston 配置
import { env } from 'config/env';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
  dirname: 'logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [transport, new winston.transports.Console()],
});
