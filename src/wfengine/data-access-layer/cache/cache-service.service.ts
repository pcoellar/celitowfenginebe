import { Injectable } from '@nestjs/common';
import { ICacheService } from './interfaces/cache-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService implements ICacheService {
  private cacheClient;
  constructor(private readonly configService: ConfigService) {
    this.cacheClient = this.createClient();
    this.cacheClient.connect();
  }

  private cacheHostName: string = this.configService.get(
    'AZURE_CACHE_FOR_REDIS_HOST_NAME',
  );
  private cachePassword: string = this.configService.get(
    'AZURE_CACHE_FOR_REDIS_ACCESS_KEY',
  );

  createClient(): any {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const redis = require('redis');
    const cacheClient = redis.createClient({
      // redis for TLS
      url: `redis://${this.cacheHostName}:6379`,
      password: this.cachePassword,
    });
    return cacheClient;
  }

  async connect() {
    await this.cacheClient.connect();
  }

  async disconnect() {
    await this.cacheClient.connect();
  }

  async get(key: string): Promise<string> {
    return await this.cacheClient.get(key);
  }

  async set(key: string, value: string) {
    await this.cacheClient.set(key, value);
  }
}
