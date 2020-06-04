import 'reflect-metadata';

import { AppointmentRepositoryFake } from '@modules/appointments/repositories';
import { ProvidersDayAvailabilityService } from '@modules/appointments/services';

let appointmentRepositoryFake: AppointmentRepositoryFake;
let providersDayAvailabilityListService: ProvidersDayAvailabilityService;

describe('ProvidersDayAvailability', () => {
  beforeEach(() => {
    appointmentRepositoryFake = new AppointmentRepositoryFake();
    providersDayAvailabilityListService = new ProvidersDayAvailabilityService(
      appointmentRepositoryFake,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-id',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await providersDayAvailabilityListService.execute({
      provider_id: 'provider-undefined',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
