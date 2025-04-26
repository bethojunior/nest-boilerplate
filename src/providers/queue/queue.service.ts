import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('send-email') private queue: Queue,
  ) {}

  async addEmailToSendQueue(email: string, subject: string, text: string, html: string) {
    await this.queue.add('handleSendEmail', { email, subject, text, html });
  }

}
