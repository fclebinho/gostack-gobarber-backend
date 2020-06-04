import { container } from 'tsyringe';

import { uploadConfig } from '@config/index';
import { IStorageProvider } from './models';
import { DiskStorageProvider, S3StorageProvider } from './implementations';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);

export * from './fakes';
export * from './implementations';
export * from './models';
