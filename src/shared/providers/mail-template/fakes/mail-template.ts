import { IMailTemplateProvider } from '@shared/providers/mail-template';

export default class MailTemplateFake implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'No content';
  }
}
