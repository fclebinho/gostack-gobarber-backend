import 'reflect-metadata';

import { UsersRepositoryFake } from '@modules/users/repositories';
import { UserProfileShowService } from '@modules/users/services';

import { ApplicationError } from '@shared/errors/application-error';

let usersRepository: UsersRepositoryFake;
let userProfileShowService: UserProfileShowService;

describe('UserProfileShow', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    userProfileShowService = new UserProfileShowService(usersRepository);
  });

  it('should be able to show profile', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const profile = await userProfileShowService.execute(user.id);

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@mail.com');
  });

  it('should be not able to show profile when user not exists', async () => {
    await expect(
      userProfileShowService.execute('non-existing'),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
