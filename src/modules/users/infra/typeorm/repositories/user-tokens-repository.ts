import { EntityRepository, Repository, getRepository } from 'typeorm';

import { IUserTokensRepository } from '@modules/users/repositories';
import UserToken from '@modules/users/infra/typeorm/entities/user-token';

@EntityRepository(UserToken)
class UserTokensRepository implements IUserTokensRepository {
  private orm: Repository<UserToken>;

  constructor() {
    this.orm = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const user = await this.orm.findOne({
      where: { token },
    });

    return user;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const token = this.orm.create({
      user_id,
    });

    await this.orm.save(token);

    return token;
  }
}

export default UserTokensRepository;
