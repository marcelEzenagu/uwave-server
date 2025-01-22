import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto, SendEmailResDto } from './dto/';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);
  private readonly provider = 'sendgrid';

  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   port: Number(process.env.MAIL_PORT),
    //   secure: false,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // });

    this.transporter = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(dto: SendEmailDto): Promise<SendEmailResDto> {
    //load email template
    let filePath = path.resolve(
      __dirname,
      `../../views/emails/${dto.template}.ejs`,
    );
    return this.transporter
      .send({
        from: process.env.MAIL_SENDER,
        to: dto.to,
        subject: dto.subject,
        html: `<p>Your OTP for ${dto.subject} is <strong>${dto.otp}</strong></p>`,
      })
      .then(() => {
        console.log('Email sent');
        return {
          message: 'Email sent',
          provider: this.provider,
        };
      })
      .catch((error) => {
        this.logger.error('email failed to sent', error);
        throw new Error(error);
      });
  }

  async d_send(dto: SendEmailDto): Promise<SendEmailResDto> {
    try {
      //load email template
      let filePath = path.resolve(
        __dirname,
        `../../views/emails/${dto.template}.ejs`,
      );
      // const html = await ejs.renderFile(filePath, dto.data);
      const response = await this.transporter.send({
        from: process.env.MAIL_SENDER,
        to: dto.to,
        subject: dto.subject,
        html: `<p>Your OTP for ${dto.subject} is <strong>${dto.otp}</strong></p>`,
      });
      console.log('RESPOSNE== ', response);

      return {
        message: response.messageId,
        provider: this.provider,
      };
    } catch (error) {
      this.logger.error('email failed to sent', error);
      throw new Error(error);
    }
  }

  // async scheduleMeeting(dto: any): Promise<SendEmailResDto> {

  //   try {
  //    const response = await this.transporter.sendMail({
  //       from: '"Kochure" <no-reply@kochure.com>',
  //       to: dto.to,
  //       subject: dto.subject,
  //       html: `<p>
  //               Your verification interview is scheduled as follow:
  //               <br/>
  //               Date : ${dto.date}
  //               <br/>
  //               MeetingLink : <a href="_blank" >${dto.link}</a>
  //               `,
  //     });
  //     return {
  //       message: response.messageId,
  //       provider: this.provider,
  //     };
  //   } catch (error) {

  //     this.logger.error('email failed to sent');
  //     throw new Error(error)
  //   }
  // }

  // async send(dto: SendEmailDto): Promise<SendEmailResDto> {
  //   try {
  //     //load email template
  //     let filePath = path.resolve(
  //       __dirname,
  //       `../../views/emails/${dto.template}.ejs`,
  //     );
  //     const html = await ejs.renderFile(filePath, dto.data);
  //     const response = await this.transporter.sendMail({
  // from: process.env.MAIL_SENDER,
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
