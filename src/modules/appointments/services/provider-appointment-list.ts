import { injectable, inject } from 'tsyringe';

import { IAppointmentRepository } from '@modules/appointments/repositories';
import { Appointment } from '@modules/appointments/infra/typeorm/entities';
import { ICacheProvider } from '@shared/providers/cache';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ProviderAppointmentList {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey,
    );

    if (!appointments) {
      appointments = await this.appointmentRepository.findAllDayFromProvider({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(cacheKey, appointments);
    }

    return appointments;
  }
}
