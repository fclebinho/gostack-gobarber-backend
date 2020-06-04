import { INotificationCreateDTO } from '@modules/notifications/dtos';
import { Notification } from '@modules/notifications/infra/typeorm/schemas';

export default interface INotifications {
  create(data: INotificationCreateDTO): Promise<Notification>;
}
