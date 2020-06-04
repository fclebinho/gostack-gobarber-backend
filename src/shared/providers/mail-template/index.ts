import { container } from 'tsyringe';

import { IMailTemplateProvider } from './models';
import { HandlebarsMailTemplateProvider } from './implementations';

import '@shared/providers/mail';

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);

export * from './dtos';
export * from './fakes';
export * from './implementations';
export * from './models';
