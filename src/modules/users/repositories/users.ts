import User from '@modules/users/infra/typeorm/entities/user';
import { IUserCreateDTO, IFindAllProviders } from '@modules/users/dtos';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProviders): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: IUserCreateDTO): Promise<User>;
  save(user: User): Promise<User>;
}
