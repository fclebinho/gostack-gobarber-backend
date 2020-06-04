import 'reflect-metadata';

import { RetrievePasswordService } from '@modules/users/services';
import { MailFakeProvider } from '@shared/providers/mail';
import {
  UsersRepositoryFake,
  UserTokensRepositoryFake,
} from '@modules/users/repositories';
import ApplicationError from '@shared/errors/application-error';

let usersRepository: UsersRepositoryFake;
let tokensRepository: UserTokensRepositoryFake;
let mailProvider: MailFakeProvider;
let retrievePasswordService: RetrievePasswordService;

describe('RetrievePassword', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    tokensRepository = new UserTokensRepositoryFake();
    mailProvider = new MailFakeProvider();
    retrievePasswordService = new RetrievePasswordService(
      usersRepository,
      tokensRepository,
      mailProvider,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'send');

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await retrievePasswordService.execute({
      email: 'johndoe@mail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      retrievePasswordService.execute({
        email: 'johndoe@mail.com',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(tokensRepository, 'generate');

    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    await retrievePasswordService.execute({
      email: 'johndoe@mail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
