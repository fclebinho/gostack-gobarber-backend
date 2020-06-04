import IORedis, { Redis } from 'ioredis';

import config from '@config/cache';
import { ICacheProvider } from '@shared/providers/cache';

export default class RedisCache implements ICacheProvider {
  private client: Redis;

  constructor() {
    this.client = new IORedis(config.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const pasedData = JSON.parse(data) as T;

    return pasedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();
    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }
}
