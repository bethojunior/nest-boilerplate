import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(
    email: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    console.log('Trying sent email: ', email);
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_USER}>`,
        to: email,
        subject,
        text,
        html,
      });
      console.log('✅ E-mail enviado:', info);
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
    }
  }
}
