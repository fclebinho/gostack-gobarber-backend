import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import { mailConfig } from '@config/index';
import { IMailTemplateProvider } from '@shared/providers/mail-template';
import { IMailProvider, ISendMailDTO } from '@shared/providers/mail';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // create Nodemailer SES transporter
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-west-2',
      }),
    });
  }

  public async send({
    to,
    from,
    subject,
    content,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;
    try {
      // Message object
      await this.client.sendMail({
        from: {
          name: from?.name || name,
          address: from?.email || email,
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await this.mailTemplateProvider.parse(content),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
