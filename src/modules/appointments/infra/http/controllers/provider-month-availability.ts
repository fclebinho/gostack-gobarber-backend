import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProvidersMonthAvailabilityService } from '@modules/appointments/services';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const service = container.resolve(ProvidersMonthAvailabilityService);

    const availability = await service.execute({ provider_id, month, year });

    return response.json(availability);
  }
}
