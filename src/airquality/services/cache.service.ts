import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private client: Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient(process.env.REDIS_NAME);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number) {
    return this.client.set(key, value, 'EX', ttl);
  }

  async delete(key: string): Promise<number | null> {
    return this.client.del(key);
  }
}
