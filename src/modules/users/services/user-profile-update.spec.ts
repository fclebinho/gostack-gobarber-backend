import 'reflect-metadata';

import { HashProviderFake } from '@modules/users/providers/hash';
import { UsersRepositoryFake } from '@modules/users/repositories';
import { UserProfileUpdateService } from '@modules/users/services';

import { ApplicationError } from '@shared/errors/application-error';

let usersRepository: UsersRepositoryFake;
let hashProvider: HashProviderFake;
let userProfileUpdateService: UserProfileUpdateService;

describe('UserProfileUpdate', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    hashProvider = new HashProviderFake();
    userProfileUpdateService = new UserProfileUpdateService(
      usersRepository,
      hashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const updatedUser = await userProfileUpdateService.execute({
      user_id: user.id,
      name: 'Hello',
      email: 'hello@world.com',
    });

    expect(updatedUser.name).toBe('Hello');
    expect(updatedUser.email).toBe('hello@world.com');
  });

  it('should be not able to update profile when user not exists', async () => {
    await expect(
      userProfileUpdateService.execute({
        user_id: 'non-existing',
        name: 'Hello',
        email: 'hello@world.com',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should be not able to change the same email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const user = await usersRepository.create({
      name: 'Another user',
      email: 'another@user.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Another user',
        email: 'johndoe@mail.com',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should be able to update password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const updatedUser = await userProfileUpdateService.execute({
      user_id: user.id,
      name: 'Hello',
      email: 'hello@world.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be not able to update password when old_password is invalid', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Hello',
        email: 'hello@world.com',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should be not able to update password without old_password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await expect(
      userProfileUpdateService.execute({
        user_id: user.id,
        name: 'Hello',
        email: 'hello@world.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
