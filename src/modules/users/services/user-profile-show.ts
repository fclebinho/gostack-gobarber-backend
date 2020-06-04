import { injectable, inject } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories';
import { ApplicationError } from '@shared/errors/application-error';

import User from '@modules/users/infra/typeorm/entities/user';

@injectable()
export default class UserProfileShow {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ApplicationError('User not found');
    }

    return user;
  }
}
