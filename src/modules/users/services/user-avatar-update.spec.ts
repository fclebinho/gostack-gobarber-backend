import 'reflect-metadata';

import { StorageFakeProvider } from '@shared/providers/storage';
import { UsersRepositoryFake } from '@modules/users/repositories';
import { UserAvatarUpdateService } from '@modules/users/services';

import { ApplicationError } from '@shared/errors/application-error';

let usersRepository: UsersRepositoryFake;
let storageProvider: StorageFakeProvider;
let userAvatarUpdateService: UserAvatarUpdateService;

describe('UserAvatarUpdate', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    storageProvider = new StorageFakeProvider();
    userAvatarUpdateService = new UserAvatarUpdateService(
      usersRepository,
      storageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await userAvatarUpdateService.execute({
      user_id: user.id,
      avatar_file_name: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should be able to update avatar when non exists user', async () => {
    await expect(
      userAvatarUpdateService.execute({
        user_id: 'non-existing-user',
        avatar_file_name: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(storageProvider, 'delete');

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await userAvatarUpdateService.execute({
      user_id: user.id,
      avatar_file_name: 'avatar.jpg',
    });

    await userAvatarUpdateService.execute({
      user_id: user.id,
      avatar_file_name: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
