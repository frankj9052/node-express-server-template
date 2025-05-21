// src/config/session.ts
import { CookieOptions, SessionOptions } from 'express-session';
import { RedisStore } from 'connect-redis';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { env } from './env';
import { redisClient, isRedisAvailable } from '../infrastructure/redis';

/* ---------- AES-256-CBC 加/解密 ---------- */
const encrypt = (plain: string) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(env.SESSION_ENCRYPTION_KEY!, 'hex'),
    Buffer.from(env.SESSION_IV!, 'hex')
  );
  return Buffer.concat([cipher.update(plain), cipher.final()]).toString('hex');
};

const decrypt = (hex: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(env.SESSION_ENCRYPTION_KEY!, 'hex'),
    Buffer.from(env.SESSION_IV!, 'hex')
  );
  const buf = Buffer.concat([decipher.update(Buffer.from(hex, 'hex')), decipher.final()]);
  return buf.toString();
};

/* ---------- Session 配置构建器 ---------- */
export const buildSessionOptions = (): SessionOptions => {
  const store = isRedisAvailable
    ? new RedisStore({
        client: redisClient,
        prefix: 'sess:',
        disableTouch: true,
        serializer: {
          stringify: sess => encrypt(JSON.stringify(sess)),
          parse: hex => JSON.parse(decrypt(hex)),
        },
      })
    : undefined;

  return {
    name: env.SESSION_COOKIE_NAME ?? 'sid',
    store,
    secret: env.SESSION_SECRET!,
    genid: () => uuidv4(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production' ? ('auto' as const) : false,
      sameSite: (env.SESSION_COOKIE_SAMESITE as CookieOptions['sameSite']) ?? 'lax',
      maxAge: Number(env.SESSION_TTL_MS) || 1000 * 60 * 60 * 24 * 7,
    },
  };
};
