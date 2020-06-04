import { IStorageProvider } from '@shared/providers/storage';

class Storage implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async delete(file: string): Promise<void> {
    const index = this.storage.findIndex(name => name === file);

    this.storage.splice(index, 1);
  }
}

export default Storage;
