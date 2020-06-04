import 'reflect-metadata';

import { HashProviderFake } from '@modules/users/providers';
import { ResetPasswordService } from '@modules/users/services';
import {
  UsersRepositoryFake,
  UserTokensRepositoryFake,
} from '@modules/users/repositories';
import ApplicationError from '@shared/errors/application-error';

let usersRepository: UsersRepositoryFake;
let tokensRepository: UserTokensRepositoryFake;
let hashProvider: HashProviderFake;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    tokensRepository = new UserTokensRepositoryFake();
    hashProvider = new HashProviderFake();
    resetPasswordService = new ResetPasswordService(
      usersRepository,
      tokensRepository,
      hashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const { token } = await tokensRepository.generate(user.id);

    const generateHash = jest.spyOn(hashProvider, 'generate');

    await resetPasswordService.execute({ token, password: '654321' });

    const updatedUser = await usersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('654321');
    expect(updatedUser?.password).toBe('654321');
  });

  it('should not be able to reset password with invalid token', async () => {
    expect(
      resetPasswordService.execute({
        token: 'non-existing',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await tokensRepository.generate('non-existing');

    expect(
      resetPasswordService.execute({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to reset password when passed more than 2 hours', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const { token } = await tokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({ token, password: '654321' }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
