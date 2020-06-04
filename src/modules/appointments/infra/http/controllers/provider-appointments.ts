import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProviderAppointmentListService } from '@modules/appointments/services';

export default class ProviderAppointments {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const service = container.resolve(ProviderAppointmentListService);

    const appointments = await service.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(appointments);
  }
}
