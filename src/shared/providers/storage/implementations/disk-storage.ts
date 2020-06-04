import fs from 'fs';
import path from 'path';

import config from '@config/upload';
import { IStorageProvider } from '@shared/providers/storage';

export default class DiskStorage implements IStorageProvider {
  public async save(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(config.tmpFolder, file),
      path.resolve(config.uploadsFolder, file),
    );

    return file;
  }

  public async delete(file: string): Promise<void> {
    const filePath = path.resolve(config.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
