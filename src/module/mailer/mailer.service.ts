import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto, SendEmailResDto } from './dto/';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';


@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);
  private readonly provider = 'sendgrid';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(dto: SendEmailDto): Promise<SendEmailResDto> {
    
    console.log("GOT HERE")
    console.log("EMAIL: ",process.env.MAIL_USER)

    // process.exit()
    try {
      //load email template
      let filePath = path.resolve(
        __dirname,
        `../../views/emails/${dto.template}.ejs`,
      );
      const html = await ejs.renderFile(filePath, dto.data);
      const response = await this.transporter.sendMail({
        from: dto.from || '"Kochure" <no-reply@kochure.com>',
        to: dto.to,
        subject: dto.subject,
        html: html,
      });
      return {
        message_id: response.messageId,
        provider: this.provider,
      };
    } catch (error) {
      this.logger.error('email failed to sent');
      throw error;
    }
  }

  // async send(dto: SendEmailDto): Promise<SendEmailResDto> {
  //   try {
  //     //load email template
  //     let filePath = path.resolve(
  //       __dirname,
  //       `../../views/emails/${dto.template}.ejs`,
  //     );
  //     const html = await ejs.renderFile(filePath, dto.data);
  //     const response = await this.transporter.sendMail({
  //       from: dto.from || '"U-SaveMarket" <no-reply@u_saveMarket.com>',
  //       to: dto.to,
  //       subject: dto.subject,
  //       html: html,
  //     });
  //     return {
  //       message_id: response.messageId,
  //       provider: this.provider,
  //     };
  //   } catch (error) {
  //     this.logger.error('email failed to sent');
  //     throw error;
  //   }
  // }
}
