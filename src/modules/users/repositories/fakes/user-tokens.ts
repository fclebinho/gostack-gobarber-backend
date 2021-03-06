import { uuid } from 'uuidv4';

import { IUserTokensRepository } from '@modules/users/repositories';
import UserToken from '@modules/users/infra/typeorm/entities/user-token';

class UserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.userTokens.find(findToken => findToken.token === token);
  }
}

export default UserTokensRepository;
