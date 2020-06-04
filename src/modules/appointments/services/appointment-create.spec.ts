import 'reflect-metadata';

import { AppointmentCreateService } from '@modules/appointments/services';
import { AppointmentRepositoryFake } from '@modules/appointments/repositories';
import { CacheFakeProvider } from '@shared/providers/cache';
import { NotificationsRepositoryFake } from '@modules/notifications/repositories';

import { ApplicationError } from '@shared/errors/application-error';

let appointmentCreateService: AppointmentCreateService;

describe('AppointmentCreate', () => {
  beforeEach(() => {
    appointmentCreateService = new AppointmentCreateService(
      new AppointmentRepositoryFake(),
      new NotificationsRepositoryFake(),
      new CacheFakeProvider(),
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await appointmentCreateService.execute({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-undefined');
    expect(appointment.user_id).toBe('user-undefined');
  });

  it('should not be able to create a new appointment on then same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await appointmentCreateService.execute({
      provider_id: 'provider-undefined',
      user_id: 'user-undefined',
      date: appointmentDate,
    });

    await expect(
      appointmentCreateService.execute({
        date: appointmentDate,
        provider_id: 'provider-undefined',
        user_id: 'user-undefined',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create a new appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      appointmentCreateService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-undefined',
        user_id: 'user-undefined',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create a new appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      appointmentCreateService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: 'provider-undefined',
        user_id: 'provider-undefined',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to create a new appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      appointmentCreateService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-undefined',
        user_id: 'user-undefined',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);

    await expect(
      appointmentCreateService.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider-undefined',
        user_id: 'user-undefined',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
