import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories';
import User from '@modules/users/infra/typeorm/entities/user';
import { ICacheProvider } from '@shared/providers/cache';

@injectable()
export default class ProvidersList {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, users);
    }

    return users;
  }
}
