import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { SessionCreateService } from '@modules/users/services';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(SessionCreateService);

    const { user, token } = await service.execute({ email, password });

    return response.json({ user: classToClass(user), token });
  }
}
