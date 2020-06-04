import 'reflect-metadata';

import { HashProviderFake } from '@modules/users/providers';
import { UserCreateService } from '@modules/users/services';
import { UsersRepositoryFake } from '@modules/users/repositories';
import { CacheFakeProvider } from '@shared/providers/cache';

import { ApplicationError } from '@shared/errors/application-error';

let hashProvider: HashProviderFake;
let usersRepository: UsersRepositoryFake;
let userCreateService: UserCreateService;

describe('UserCreate', () => {
  beforeEach(() => {
    hashProvider = new HashProviderFake();
    usersRepository = new UsersRepositoryFake();
    userCreateService = new UserCreateService(
      usersRepository,
      hashProvider,
      new CacheFakeProvider(),
    );
  });

  it('should be able to create a new user', async () => {
    const user = await userCreateService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user on then same email', async () => {
    await userCreateService.execute({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123123',
    });

    await expect(
      userCreateService.execute({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
