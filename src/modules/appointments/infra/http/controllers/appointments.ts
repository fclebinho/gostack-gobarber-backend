import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppointmentCreateService } from '@modules/appointments/services';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const service = container.resolve(AppointmentCreateService);

    const appointment = await service.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }
}
