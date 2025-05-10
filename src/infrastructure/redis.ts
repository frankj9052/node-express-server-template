import Redis from 'ioredis';
import { env } from '../config/env';

export let isRedisAvailable = true;

export const redisClient = new Redis(env.REDIS_URL, {
  tls: {},
  retryStrategy(times) {
    const delay = Math.min(times * 3000, 10000);
    console.warn(`⚠️ Redis reconnect attempt #${times}, retrying in ${delay} ms`);
    return delay;
  },
});

export async function connectRedis() {
  try {
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

    console.log('✅ Redis connection established.');
    isRedisAvailable = true;
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    isRedisAvailable = false;
  }

  redisClient.on('error', err => {
    console.error('❗ Redis connection error:', err.message);
    isRedisAvailable = false;
  });

  redisClient.on('end', () => {
    console.warn('🔌 Redis connection closed.');
    isRedisAvailable = false;
  });

  redisClient.on('ready', () => {
    console.log('🔁 Redis reconnected.');
    isRedisAvailable = true;
  });
}

export async function closeRedisConnection() {
  if (redisClient) {
    console.log('🧹 Closing Redis connection...');
    try {
      await redisClient.quit();
      console.log('🛑 Redis client disconnected.');
    } catch (error) {
      console.error('❗ Error closing Redis connection:', error);
    }
  }
}
