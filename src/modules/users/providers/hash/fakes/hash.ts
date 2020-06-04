import { IHashProvider } from '@modules/users/providers';

class BCryptHash implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return payload;
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}

export default BCryptHash;
