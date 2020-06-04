import { injectable, inject } from 'tsyringe';

import { IHashProvider } from '@modules/users/providers/hash';
import { IUsersRepository } from '@modules/users/repositories';
import { ApplicationError } from '@shared/errors/application-error';

import User from '@modules/users/infra/typeorm/entities/user';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UserProfileUpdate {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ApplicationError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new ApplicationError('Email already in use');
    }

    Object.assign(user, {
      name,
      email,
    });

    if (password && !old_password) {
      throw new ApplicationError('Old password is required');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compare(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new ApplicationError('Old password is invalid');
      }
    }

    if (password) {
      user.password = await this.hashProvider.generate(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UserProfileUpdate;
