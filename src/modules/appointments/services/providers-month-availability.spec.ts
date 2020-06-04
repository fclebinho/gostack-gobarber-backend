import 'reflect-metadata';

import { AppointmentRepositoryFake } from '@modules/appointments/repositories';
import { ProvidersMonthAvailabilityService } from '@modules/appointments/services';

let appointmentRepositoryFake: AppointmentRepositoryFake;
let providersMonthAvailabilityListService: ProvidersMonthAvailabilityService;

describe('ProvidersMonthAvailability', () => {
  beforeEach(() => {
    appointmentRepositoryFake = new AppointmentRepositoryFake();
    providersMonthAvailabilityListService = new ProvidersMonthAvailabilityService(
      appointmentRepositoryFake,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await providersMonthAvailabilityListService.execute({
      provider_id: 'provider-undefined',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
