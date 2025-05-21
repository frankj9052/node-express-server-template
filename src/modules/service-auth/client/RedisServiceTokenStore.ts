// src/modules/service-auth/client/RedisServiceTokenStore.ts
import { redisClient } from '@/infrastructure/redis'; // 你已有的 Redis 实例
import { z } from 'zod';

// TTL 是 Time To Live 的缩写，意思是“存活时间”或“有效期”。
// 根据过期时间戳计算当前时间到过期时间之间的 TTL（单位：秒），最小为 0，防止负数
const getTTL = (exp: number) => Math.max(0, exp - Math.floor(Date.now() / 1000));

const schema = z.object({
  token: z.string(),
  exp: z.number(), // epoch 秒级
});

export class RedisServiceTokenStore {
  static async get(serviceId: string): Promise<{ token: string; exp: number } | null> {
    const json = await redisClient.get(`service-token:${serviceId}`);
    if (!json) return null;

    try {
      return schema.parse(JSON.parse(json));
    } catch {
      return null;
    }
  }

  static async set(serviceId: string, token: string, exp: number) {
    await redisClient.set(
      `service-token:${serviceId}`,
      JSON.stringify({ token, exp }),
      'EX',
      getTTL(exp)
    );
  }

  static async clear(serviceId: string) {
    await redisClient.del(`service-token:${serviceId}`);
  }
}
