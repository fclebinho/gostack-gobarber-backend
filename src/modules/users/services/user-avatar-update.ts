import { injectable, inject } from 'tsyringe';

import { IStorageProvider } from '@shared/providers/storage';
import { IUsersRepository } from '@modules/users/repositories';
import { ApplicationError } from '@shared/errors/application-error';
import User from '@modules/users/infra/typeorm/entities/user';

interface IUserRequest {
  user_id: string;
  avatar_file_name: string;
}

@injectable()
class UserAvatarUpdate {
  constructor(
    @inject('UsersRepository')
    private repository: IUsersRepository,
    @inject('StorageProvider')
    private storage: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatar_file_name,
  }: IUserRequest): Promise<User> {
    const user = await this.repository.findById(user_id);

    if (!user) {
      throw new ApplicationError('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      await this.storage.delete(user.avatar);
    }

    const fileName = await this.storage.save(avatar_file_name);
    user.avatar = fileName;
    await this.repository.save(user);

    return user;
  }
}

export default UserAvatarUpdate;
