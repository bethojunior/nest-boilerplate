import { ITemplatePath } from 'src/@types/utils/template-path';
import { QueueService } from "src/providers/queue/queue.service";
import * as ejs from 'ejs';
import { Injectable } from '@nestjs/common';

@Injectable()
class SendAlertLoginJob {
  constructor(private readonly queueService: QueueService) { }

  async handle(name: string, email: string) {
    const appName = process.env.APP_NAME || 'Madgic';
    const subject = `Alerta de login | ${appName}`;
    const text = `${new Date()}`;
    const templatePath = ITemplatePath('login-email.ejs');
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

export { SendAlertLoginJob }
