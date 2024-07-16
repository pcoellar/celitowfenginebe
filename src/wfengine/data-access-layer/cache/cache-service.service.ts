import { Injectable } from '@nestjs/common';
import { ICacheService } from './interfaces/cache-service.interface';
import { ConfigService } from '@nestjs/config';
import redis from 'redis';

@Injectable()
export class CacheService implements ICacheService {
  constructor(private readonly configService: ConfigService) {}

  private cacheHostName: string = this.configService.get(
    'AZURE_CACHE_FOR_REDIS_HOST_NAME',
  );
  private cachePassword: string = this.configService.get(
    'AZURE_CACHE_FOR_REDIS_ACCESS_KEY',
  );

  createClient(): any {
    const cacheClient = redis.createClient({
      // redis for TLS
      url: `redis://${this.cacheHostName}:6380`,
      password: this.cachePassword,
    });
    return cacheClient;
  }

  async connect(cacheClient: any) {
    await cacheClient.connect();
  }

  async disconnect(cacheClient: any) {
    await cacheClient.connect();
  }

  async get(cacheClient: any, key: string): Promise<string> {
    return await cacheClient.get(key);
  }

  async set(cacheClient: any, key: string, value: string) {
    await cacheClient.set(key, value);
  }
}
