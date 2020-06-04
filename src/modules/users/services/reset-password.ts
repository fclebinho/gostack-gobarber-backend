import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import { IHashProvider } from '@modules/users/providers';
import {
  IUsersRepository,
  IUserTokensRepository,
} from '@modules/users/repositories';
import ApplicationError from '@shared/errors/application-error';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPassword {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new ApplicationError('User token does not exists');
    }

    const user = await this.repository.findById(userToken.user_id);

    if (!user) {
      throw new ApplicationError('User does not exists');
    }

    if (differenceInHours(Date.now(), userToken.created_at) > 2) {
      throw new ApplicationError('Token expired');
    }

    user.password = await this.hashProvider.generate(password);
    await this.repository.save(user);
  }
}

export default ResetPassword;
