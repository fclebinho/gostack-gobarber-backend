import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import { UserAvatarUpdateService } from '@modules/users/services';

export default class AvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(UserAvatarUpdateService);

    const user = await service.execute({
      user_id: request.user.id,
      avatar_file_name: request.file.filename,
    });

    return response.json(classToClass(user));
  }
}
