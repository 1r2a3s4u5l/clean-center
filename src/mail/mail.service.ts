import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Admin } from '../admin/model/admin.model';
import { IOption } from '../admin/admin.service';

@Injectable()
export class MailService {
  constructor(private mailerServie: MailerService) {}

  async sendConfirmation(option: IOption): Promise<void> {
    const url = `${process.env.API_HOST}/api/${option.who}/activate/${option.activation_link}`;
    console.log('----------->', url);
    await this.mailerServie.sendMail({
      to: option.email,
      subject: 'Welcome to Cleaning_Center App! Confirm your Email!',
      template: './confirmation',
      context: {
        name: option.name,
        url,
      },
    });
  }
}
