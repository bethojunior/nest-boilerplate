import { join } from 'path';
import { EnvEnum } from 'src/enums/env.enum';
const ITemplatePath = (file: string) => {
  if(process.env.ENV == EnvEnum.PRODUCTION)
    return join(process.cwd(), 'dist', 'src', 'assets', 'templates', file);

  if(process.env.ENV == EnvEnum.DEVELOPMENT)
    return join(process.cwd(), 'src', 'assets', 'templates', file);

  return join(process.cwd(), 'src', 'assets', 'templates', file);
}

export { ITemplatePath };
