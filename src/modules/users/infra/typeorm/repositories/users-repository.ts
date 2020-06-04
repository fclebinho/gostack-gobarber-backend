import { EntityRepository, Repository, getRepository, Not } from 'typeorm';

import { IUserCreateDTO, IFindAllProviders } from '@modules/users/dtos';
import { IUsersRepository } from '@modules/users/repositories';
import User from '@modules/users/infra/typeorm/entities/user';

@EntityRepository(User)
class UsersRepository implements IUsersRepository {
  private orm: Repository<User>;

  constructor() {
    this.orm = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.orm.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.orm.findOne({
      where: { email },
    });

    return user;
  }

  public async create(data: IUserCreateDTO): Promise<User> {
    const user = this.orm.create(data);
    this.orm.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.orm.save(user);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProviders): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      users = await this.orm.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.orm.find();
    }

    return users;
  }
}

export default UsersRepository;
