import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { BCryptHashProvider } from '@modules/users/providers/hash';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories';
import { UserCreateService } from '@modules/users/services';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const hashProvider = container.resolve(BCryptHashProvider);
    const usersRepository = container.resolve(UsersRepository);
    const userCreateService = new UserCreateService(
      usersRepository,
      hashProvider,
    );
    const user = await userCreateService.execute({
      name,
      email,
      password,
    });

    return response.json(classToClass(user));
  }
}
