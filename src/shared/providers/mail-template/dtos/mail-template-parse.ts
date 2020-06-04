interface IVariableTemplate {
  [key: string]: string | number;
}

export default interface IMailTemplateParse {
  file: string;
  variables: IVariableTemplate;
}
