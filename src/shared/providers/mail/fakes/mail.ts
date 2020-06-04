import { IMailProvider, ISendMailDTO } from '@shared/providers/mail';

class Mail implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async send(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default Mail;
