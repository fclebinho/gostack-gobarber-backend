import { startOfHour, isBefore, getHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import { IAppointmentRepository } from '@modules/appointments/repositories';
import { ApplicationError } from '@shared/errors/application-error';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

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

    return appointment;
  }
}

export default AppointmentCreate;
