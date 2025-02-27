import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getKey(key: string): Promise<any> {
    await this.redis.get(key);
  }

  async setKey(key: string, value: string, expire?: number): Promise<void> {
    if (expire) {
      await this.redis.set(key, value, 'EX', expire);
    } else {
      await this.redis.set(key, value);
    }
  }

  async deleteKey(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string) {
    return this.redis.exists(key);
  }
}
