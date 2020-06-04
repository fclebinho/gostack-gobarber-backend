import 'reflect-metadata';

import { HashProviderFake } from '@modules/users/providers';
import { SessionCreateService } from '@modules/users/services';
import { UsersRepositoryFake } from '@modules/users/repositories';

import { ApplicationError } from '@shared/errors/application-error';

let hashProvider: HashProviderFake;
let usersRepository: UsersRepositoryFake;
let sessionCreateService: SessionCreateService;

describe('SessionCreate', () => {
  beforeEach(() => {
    hashProvider = new HashProviderFake();
    usersRepository = new UsersRepositoryFake();
    sessionCreateService = new SessionCreateService(
      usersRepository,
      hashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const response = await sessionCreateService.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate when user not exists', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await expect(
      sessionCreateService.execute({
        email: 'invalid@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await expect(
      sessionCreateService.execute({
        email: 'johndoe@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
