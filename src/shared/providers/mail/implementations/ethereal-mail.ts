import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import { IMailTemplateProvider } from '@shared/providers/mail-template';
import { IMailProvider, ISendMailDTO } from '@shared/providers/mail';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
      // Create a SMTP transporter object
      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  public async send({
    to,
    from,
    subject,
    content,
  }: ISendMailDTO): Promise<void> {
    // Message object
    const message: SendMailOptions = {
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(content),
    };

    const result = await this.client.sendMail(message);

    console.log('Message sent: %s', result.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
  }
}
