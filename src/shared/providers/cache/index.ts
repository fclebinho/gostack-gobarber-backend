import { container } from 'tsyringe';

import { ICacheProvider } from './models';
import { RedisCacheProvider } from './implementations';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);

export { default, default as ICacheProvider } from './models/cache';
export * from './fakes';
