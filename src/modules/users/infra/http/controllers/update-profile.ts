import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import {
  UserProfileUpdateService,
  UserProfileShowService,
} from '@modules/users/services';

export default class UpdateProfile {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(UserProfileShowService);

    const user = await showProfileService.execute(user_id);

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, old_password, password } = request.body;

    const updatedProfileService = container.resolve(UserProfileUpdateService);

    const user = await updatedProfileService.execute({
      user_id: request.user.id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }
}
