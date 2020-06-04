import { uuid } from 'uuidv4';

import { IUserCreateDTO, IFindAllProviders } from '@modules/users/dtos';
import { IUsersRepository } from '@modules/users/repositories';

import User from '@modules/users/infra/typeorm/entities/user';

class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async create(data: IUserCreateDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(find => find.id === user.id);

    this.users[index] = user;

    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProviders): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }
}

export default UsersRepository;
