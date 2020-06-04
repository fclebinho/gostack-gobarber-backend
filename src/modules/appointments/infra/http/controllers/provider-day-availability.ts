import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProvidersDayAvailabilityService } from '@modules/appointments/services';

export default class ProvidersDayAvailability {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const service = container.resolve(ProvidersDayAvailabilityService);

    const availability = await service.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
