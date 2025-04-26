import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from './mail.service';
import { WorkerHost } from '@nestjs/bullmq';

@Processor('send-email')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
    console.log('✅ MailProcessor registed!');
  }

  async process(job: Job<{ email: string; subject: string; text: string; html: string }>) {
    console.log('Init job process e-mail:', job.data.email);

    const { email, subject, text, html } = job.data;
    try {
      console.log(`Try send e-mail to: ${email}`);
      await this.mailService.sendMail(email, subject, text, html);
      console.log(`✅ E-mail sent with success to ${email}`);
    } catch (error) {
      console.error(`❌ Error to sent e-mail to ${email}:`, error);
    }
  }
}
