import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class MailService {
  constructor() {}

  async sendMail(email: string, title: string, body: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
      });
      console.log('mail info:', info.response);
      return info;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
