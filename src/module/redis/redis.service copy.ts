
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisService implements OnModuleInit, OnModuleDestroy {
//   private redisClient: Redis;

//   onModuleInit() {
//     // Connect to Redis (default is localhost:6379)
//    console.log(" process.env.::", process.env)
   
//     this.redisClient = new Redis({
//       // host: "localhost",
//       // host: process.env.REDIS_HOST,
//       // port:Number(process.env.REDIS_PORT)
//       set
      
//     });
//   }

//   async setValue(key: string, value: string): Promise<void> {
//     await this.redisClient.set(key, value);
//   }

//   async getValue(key: string): Promise<string> {
//     return await this.redisClient.get(key);
//   }

//   onModuleDestroy() {
//     this.redisClient.quit();
//   }
// }
