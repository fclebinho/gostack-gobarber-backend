import { EntityRepository, MongoRepository, getMongoRepository } from 'typeorm';

import { INotificationCreateDTO } from '@modules/notifications/dtos';
import { INotificationsRepository } from '@modules/notifications/repositories';
import { Notification } from '@modules/notifications/infra/typeorm/schemas';

@EntityRepository(Notification)
export default class Notifications implements INotificationsRepository {
  private orm: MongoRepository<Notification>;

  constructor() {
    this.orm = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    recipient_id,
    content,
  }: INotificationCreateDTO): Promise<Notification> {
    const notification = this.orm.create({ recipient_id, content });
    await this.orm.save(notification);

    return notification;
  }
}
