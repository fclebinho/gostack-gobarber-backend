import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import mime from 'mime';

import config from '@config/upload';
import { IStorageProvider } from '@shared/providers/storage';

export default class S3Storage implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({});
  }

  public async save(file: string): Promise<string> {
    const originalPath = path.resolve(config.tmpFolder, file);

    const ContentType = mime.getType(originalPath);
    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: config.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);
    return file;
  }

  public async delete(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: config.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
