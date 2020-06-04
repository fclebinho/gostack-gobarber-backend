import { ObjectID } from 'mongodb';

import { INotificationCreateDTO } from '@modules/notifications/dtos';
import { INotificationsRepository } from '@modules/notifications/repositories';
import { Notification } from '@modules/notifications/infra/typeorm/schemas';

export default class Notifications implements INotificationsRepository {
  private notificarions: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: INotificationCreateDTO): Promise<Notification> {
    const notification = new Notification(); // this.orm.create({ recipient_id, content });

    Object.assign(notification, { id: new ObjectID(), recipient_id, content });

    this.notificarions.push(notification);

    return notification;
  }
}
