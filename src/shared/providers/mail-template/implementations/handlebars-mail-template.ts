import handlebars from 'handlebars';
import fs from 'fs';

import {
  IMailTemplateProvider,
  IMailTemplateParseDTO,
} from '@shared/providers/mail-template';

export default class HandlebarsMailTemplate implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IMailTemplateParseDTO): Promise<string> {
    const fileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(fileContent);
    return parseTemplate(variables);
  }
}
