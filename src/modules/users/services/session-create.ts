import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import { IHashProvider } from '@modules/users/providers';
import { IUsersRepository } from '@modules/users/repositories';
import { ApplicationError } from '@shared/errors/application-error';
import authConfig from '@config/authentication';
import User from '@modules/users/infra/typeorm/entities/user';

interface ISessionRequest {
  email: string;
  password: string;
}

interface ISessionResponse {
  user: User;
  token: string;
}

@injectable()
class SessionCreate {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ISessionRequest): Promise<ISessionResponse> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new ApplicationError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new ApplicationError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default SessionCreate;
