import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { ProvidersListService } from '@modules/appointments/services';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(ProvidersListService);

    const providers = await service.execute(user_id);

    return response.json(classToClass(providers));
  }
}
