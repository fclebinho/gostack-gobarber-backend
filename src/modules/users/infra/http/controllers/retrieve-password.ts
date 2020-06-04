import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RetrievePasswordService } from '@modules/users/services';

export default class RetrievePassword {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const service = container.resolve(RetrievePasswordService);

    await service.execute({ email });

    return response.status(204).send();
  }
}
