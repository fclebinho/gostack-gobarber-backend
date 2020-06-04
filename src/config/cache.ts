import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      port: process.env.REDIS_PORT, // Redis port
      host: process.env.REDIS_HOST, // Redis host
      family: process.env.REDIS_FAMILY, // 4 (IPv4) or 6 (IPv6)
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB,
    },
  },
} as ICacheConfig;
