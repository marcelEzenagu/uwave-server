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
    
   
    try {
      //load email template
      let filePath = path.resolve(
        __dirname,
        `../../views/emails/${dto.template}.ejs`,
      );
      // const html = await ejs.renderFile(filePath, dto.data);
      const response = await this.transporter.sendMail({
        from: dto.from || '"Kochure" <no-reply@kochure.com>',
        to: dto.to,
        subject: dto.subject,
        html: `<p>Your OTP for ${dto.subject} is <strong>${dto.otp}</strong></p>`,
      });
      
      return {
        message_id: response.messageId,
        provider: this.provider,
      };
    } catch (error) {

      this.logger.error('email failed to sent');
      throw new Error(error)
    }
  }
  async scheduleMeeting(dto: any): Promise<SendEmailResDto> {
    
   
    try {
     const response = await this.transporter.sendMail({
        from: '"Kochure" <no-reply@kochure.com>',
        to: dto.to,
        subject: dto.subject,
        html: `<p>
                Your verification interview is scheduled as follow:
                <br/>
                Date : ${dto.date}
                <br/>
                MeetingLink : <a href="_blank" >${dto.link}</a>
                `,
      });
      return {
        message_id: response.messageId,
        provider: this.provider,
      };
    } catch (error) {

      this.logger.error('email failed to sent');
      throw new Error(error)
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
