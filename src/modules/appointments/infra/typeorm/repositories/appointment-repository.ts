import { EntityRepository, Repository, getRepository, Raw } from 'typeorm';

import {
  ICreateAppointmentDTO,
  IFindAllMonthFromProviderDTO,
  IFindAllDayFromProviderDTO,
} from '@modules/appointments/dtos';
import { IAppointmentRepository } from '@modules/appointments/repositories';
import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';

@EntityRepository(Appointment)
export class AppointmentRepository implements IAppointmentRepository {
  private orm: Repository<Appointment>;

  constructor() {
    this.orm = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.orm.findOne({
      where: {
        date,
        provider_id,
      },
    });

    return findAppointment;
  }

  public async findAllMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.orm.find({
      where: {
        provider_id,
        date: Raw(
          field => `to_char(${field}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  public async findAllDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.orm.find({
      where: {
        provider_id,
        date: Raw(
          field =>
            `to_char(${field}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.orm.create({ provider_id, user_id, date });
    await this.orm.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
