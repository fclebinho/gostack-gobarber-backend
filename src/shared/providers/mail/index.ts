import { container } from 'tsyringe';

import { mailConfig } from '@config/index';
import {
  EtherealMailProvider,
  SESMailProvider,
} from '@shared/providers/mail/implementations';
import { IMailProvider } from './model';

import '@shared/providers/mail-template';

export const mailProviders = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProviders[mailConfig.driver],
);

export * from './dtos';
export * from './fakes';
export * from './implementations';
export * from './model';
