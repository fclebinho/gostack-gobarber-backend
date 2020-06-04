import 'reflect-metadata';

import { AppointmentRepositoryFake } from '@modules/appointments/repositories';
import { ProviderAppointmentListService } from '@modules/appointments/services';
import { CacheFakeProvider } from '@shared/providers/cache';

let appointmentRepositoryFake: AppointmentRepositoryFake;
let providerAppointmentListService: ProviderAppointmentListService;

describe('ProviderAppointmentList', () => {
  beforeEach(() => {
    appointmentRepositoryFake = new AppointmentRepositoryFake();
    providerAppointmentListService = new ProviderAppointmentListService(
      appointmentRepositoryFake,
      new CacheFakeProvider(),
    );
  });

  it('should be able to list the appointments availability on a especific day', async () => {
    const appointment1 = await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointment2 = await appointmentRepositoryFake.create({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const availability = await providerAppointmentListService.execute({
      provider_id: 'provider-undefined',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual([appointment1, appointment2]);
  });
});
