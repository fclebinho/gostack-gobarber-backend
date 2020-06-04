import { ISendMailDTO } from '@shared/providers/mail';

export default interface IMail {
  send(data: ISendMailDTO): Promise<void>;
}
