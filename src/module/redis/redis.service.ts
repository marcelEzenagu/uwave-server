
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  onModuleInit() {
    // Connect to Redis (default is localhost:6379)
    this.redisClient = new Redis({
      host: "localhost",
    //   host: process.env.REDIS-HOST,

    //   port:process.env.REDIS-PORT,
      port:6379
      
    });
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
