import { DynamicModule, Module } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';

export const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT_TOKEN';
export type RedisModuleOptions = RedisOptions;

@Module({})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
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
        },
      ],
    };
  }
}
