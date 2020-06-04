import { IMailTemplateParseDTO } from '@shared/providers/mail-template';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  content: IMailTemplateParseDTO;
}
