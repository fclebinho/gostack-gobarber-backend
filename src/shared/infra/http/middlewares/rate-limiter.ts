import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { ApplicationError } from '@shared/errors/application-error';

const client = redis.createClient({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  family: process.env.REDIS_FAMILY,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB,
});

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch (error) {
    throw new ApplicationError('Too Many Requests', 429);
  }
}
