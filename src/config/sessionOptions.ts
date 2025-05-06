import session from 'express-session';
import { RedisStore } from 'connect-redis';
import crypto from 'crypto';
import { env } from './env';
import { redisClient } from 'infrastructure/redis';

// 自定义加密器（AES-256-CBC 示例）
const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(env.SESSION_ENCRYPTION_KEY!, 'hex'),
    Buffer.from(env.SESSION_IV!, 'hex')
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

const decrypt = (text: string) => {
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(env.SESSION_ENCRYPTION_KEY!, 'hex'),
    Buffer.from(env.SESSION_IV!, 'hex')
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const sessionOptions: session.SessionOptions = {
  store: new RedisStore({
    client: redisClient,
    serializer: {
      stringify: session => encrypt(JSON.stringify(session)),
      parse: data => JSON.parse(decrypt(data)),
    },
    prefix: 'sess:', // 可以自定义 Redis 键前缀（可选）
  }),
  secret: env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  proxy: true, // 重要！如果 behind proxy (比如 nginx)
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 天
  },
};
