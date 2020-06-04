import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import {
  ICreateAppointmentDTO,
  IFindAllMonthFromProviderDTO,
  IFindAllDayFromProviderDTO,
} from '@modules/appointments/dtos';
import { IAppointmentRepository } from '@modules/appointments/repositories';

import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

class AppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );
  }

  public async findAllMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
