import 'reflect-metadata';

import { UsersRepositoryFake } from '@modules/users/repositories';
import { ProvidersListService } from '@modules/appointments/services';
import { CacheFakeProvider } from '@shared/providers/cache';

let usersRepository: UsersRepositoryFake;
let providersListService: ProvidersListService;

describe('ProvidersList', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryFake();
    providersListService = new ProvidersListService(
      usersRepository,
      new CacheFakeProvider(),
    );
  });

  it('should be able to list the providers', async () => {
    const provider1 = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
    });

    const provider2 = await usersRepository.create({
      name: 'John Toe',
      email: 'johntoe@mail.com',
      password: '123456',
    });

    const loggedUser = await usersRepository.create({
      name: 'John Toe',
      email: 'johntoe@mail.com',
      password: '123456',
    });

    const providers = await providersListService.execute(loggedUser.id);

    expect(providers).toEqual([provider1, provider2]);
  });
});
