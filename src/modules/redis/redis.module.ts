import { DynamicModule, Global, Module } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT_TOKEN';
export type RedisModuleOptions = RedisOptions;

@Global()
@Module({})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    const redisProvider = {
      provide: REDIS_CLIENT_TOKEN,
      useFactory: () => {
        const defaultOptions = {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        };
        const newOptions = { ...defaultOptions, ...options };
        console.log('newOptions:::', newOptions);
        const redis = new Redis(newOptions);
        return redis;
      },
    };
    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
