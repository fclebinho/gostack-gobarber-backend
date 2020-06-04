import { injectable, inject } from 'tsyringe';

import { IHashProvider } from '@modules/users/providers';
import { IUsersRepository } from '@modules/users/repositories';
import { ApplicationError } from '@shared/errors/application-error';
import User from '@modules/users/infra/typeorm/entities/user';
import { ICacheProvider } from '@shared/providers/cache';

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class UserCreate {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IUserRequest): Promise<User> {
    const checkUserExists = await this.repository.findByEmail(email);

    if (checkUserExists) {
      throw new ApplicationError('Email address already used.');
    }

    const hashedPassword = await this.hashProvider.generate(password);

    const user = await this.repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default UserCreate;
