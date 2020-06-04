import { injectable, inject } from 'tsyringe';
import path from 'path';

import { IMailProvider } from '@shared/providers/mail';
import {
  IUsersRepository,
  IUserTokensRepository,
} from '@modules/users/repositories';
import ApplicationError from '@shared/errors/application-error';

interface IRequest {
  email: string;
}

@injectable()
class RetrievePassword {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new ApplicationError('User not exists');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const retrieveMailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'retrieve-password.hbs',
    );

    await this.mailProvider.send({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      content: {
        file: retrieveMailTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default RetrievePassword;
