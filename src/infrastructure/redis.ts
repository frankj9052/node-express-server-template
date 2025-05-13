import Redis from 'ioredis';
import { env } from '../config/env';
import { createLoggerWithContext } from '@modules/common/lib/logger';

const logger = createLoggerWithContext('Redis');
export let isRedisAvailable = true;

export const redisClient = new Redis(env.REDIS_URL, {
  tls: {},
  retryStrategy(times) {
    const delay = Math.min(times * 3000, 10000);
    logger.warn(`⚠️ Reconnect attempt #${times}, retrying in ${delay} ms`);
    return delay;
  },
});

export async function connectRedis() {
  try {
    logger.info('🔌 Connecting...');
    // 等待 Redis 客户端 ready
    await new Promise<void>((resolve, reject) => {
      if (redisClient.status === 'ready') {
        resolve();
      } else {
        redisClient.once('ready', resolve);
        redisClient.once('error', reject);
      }
    });

    // 验证 Redis 连接是否真正可用
    const pong = await redisClient.ping();
    if (pong !== 'PONG') {
      throw new Error('Redis ping failed');
    }

    isRedisAvailable = true;
    logger.info('✅ Connection established and ping verified.');
  } catch (error) {
    isRedisAvailable = false;
    logger.error('❌ Failed to connect or ping Redis', error);
  }

  redisClient.on('error', err => {
    isRedisAvailable = false;
    logger.error('❗ Connection error', err);
  });

  redisClient.on('end', () => {
    isRedisAvailable = false;
    logger.warn('🔌 Connection closed.');
  });

  redisClient.on('ready', () => {
    isRedisAvailable = true;
    logger.info('🔁 Connection ready.');
  });
}

export async function closeRedisConnection() {
  if (redisClient) {
    logger.info('🧹 Closing connection...');
    try {
      await redisClient.quit();
      logger.info('🛑 Connection closed cleanly.');
    } catch (error) {
      logger.error('❗ Error while closing connection', error);
    }
  }
}
