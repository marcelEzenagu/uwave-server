import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = await createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
    this.redisClient.connect();
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
  async remove(key: string): Promise<void> {
    console.log('called DELETE');
    await this.redisClient.del(key);
  }

  async setTimedValue(
    key: string,
    value: string,
    timeInSeconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, { EX: timeInSeconds });
  }

  async getValue(key: string): Promise<string> {
    return await this.redisClient.get(key);
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
