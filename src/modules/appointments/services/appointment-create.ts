import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { INotificationsRepository } from '@modules/notifications/repositories';
import { IAppointmentRepository } from '@modules/appointments/repositories';
import { ApplicationError } from '@shared/errors/application-error';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';
import { ICacheProvider } from '@shared/providers/cache';

export interface IAppointmentRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class AppointmentCreate {
  constructor(
    @inject('AppointmentRepository')
    private repository: IAppointmentRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IAppointmentRequest): Promise<Appointment> {
    const parsedDate = startOfHour(date);

    if (isBefore(parsedDate, Date.now())) {
      throw new ApplicationError(
        "You can't create an appointment on a past date.",
      );
    }

    if (provider_id === user_id) {
      throw new ApplicationError(
        "You can't create an appointment with yourself.",
      );
    }

    if (getHours(parsedDate) < 8 || getHours(parsedDate) > 17) {
      throw new ApplicationError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.repository.findByDate(
      parsedDate,
    );

    if (findAppointmentInSameDate) {
      throw new ApplicationError('This appointment is already booked');
    }

    const appointment = await this.repository.create({
      provider_id,
      user_id,
      date: parsedDate,
    });

    const dateFormatted = format(parsedDate, "dd/MM/yyyy 'às' HH:mm'h'");
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`,
    });

    const cacheKey = `provider-appointments:${provider_id}:${format(
      appointment.date,
      'yyyy-M-d',
    )}`;
    await this.cacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default AppointmentCreate;
