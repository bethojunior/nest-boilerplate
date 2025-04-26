import { ITemplatePath } from 'src/@types/utils/template-path';
import * as ejs from 'ejs';
import { QueueService } from "src/providers/queue/queue.service";
import { Injectable } from "@nestjs/common";

@Injectable()
class SendWelcomeRegisterJob
{
  constructor(private readonly queueService: QueueService) { }

  async handle(email: string)
  {
    const appName = process.env.APP_NAME || 'Madgic';
    const subject = `Bem vindo ao ${appName}`;
    const text = `${new Date()}`;
    const templatePath = ITemplatePath('welcome-email.ejs');
    const html = await ejs.renderFile(templatePath, {
      appName,
      date: new Date().toLocaleString(),
    });

    await this.queueService.addEmailToSendQueue(
      email,
      subject,
      text,
      html,
    );
  }
}

export { SendWelcomeRegisterJob }
