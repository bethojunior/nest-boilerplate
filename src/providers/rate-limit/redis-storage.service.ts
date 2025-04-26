import { ThrottlerStorage } from '@nestjs/throttler';
import { RedisClientType, createClient } from 'redis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

export class RedisThrottlerStorage implements ThrottlerStorage {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      }
    });
    this.client.connect();
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const multi = this.client.multi();
    multi.incr(key);
    multi.expire(key, ttl);
    multi.ttl(key);
    const results = await multi.exec();
    const totalHits = results[0] as number;
    const timeToExpire = results[2] as number;

    const isBlocked = totalHits > limit;
    const timeToBlockExpire = isBlocked ? blockDuration : 0;

    return {
      totalHits,
      timeToExpire,
      isBlocked,
      timeToBlockExpire,
    };
  }

  async get(key: string): Promise<ThrottlerStorageRecord> {
    const multi = this.client.multi();
    multi.get(key);
    multi.ttl(key);
    const results = await multi.exec();
    const totalHits = results[0] ? Number(results[0]) : 0;
    const timeToExpire = results[1] as number;

    return {
      totalHits,
      timeToExpire,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
