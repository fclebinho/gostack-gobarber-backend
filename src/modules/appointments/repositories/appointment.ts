import Appointment from '@modules/appointments/infra/typeorm/entities/appointment';
import {
  ICreateAppointmentDTO,
  IFindAllMonthFromProviderDTO,
  IFindAllDayFromProviderDTO,
} from '@modules/appointments/dtos';

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllMonthFromProvider(
    data: IFindAllMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllDayFromProvider(
    data: IFindAllDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
