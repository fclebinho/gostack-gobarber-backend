import { IMailTemplateParseDTO } from '@shared/providers/mail-template';

export default interface IMailTemplate {
  parse(data: IMailTemplateParseDTO): Promise<string>;
}
