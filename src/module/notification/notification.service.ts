import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, SendEmailDto, SendSmsDto } from './dto';
import { MESSAGE_TEMPLATE, NOTIFICATION_TYPE } from './enum';
// import { EmailTokenType, OtpType } from 'src/auth/enum';
import { MailerService } from '../mailer/mailer.service';
import { SendPushDto } from './dto/send-push-notification.dto';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class NotificationService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

 

  private async sendEmail(emailDto: SendEmailDto) {
    this.mailerService
      .send(emailDto)
      .then((response) => {
        const { message_id, provider } = response;
      })
      .catch((error) => {
        // Handle the error here
        console.error('Error sending email:', error);
      });
  }

  
  sendWelcomeEmail(email: string, fname: string) {
    // send welcome email
    let emailDto: SendEmailDto = {
      to: email,
      subject: 'Welcome to Kobbofy',
      template: MESSAGE_TEMPLATE.WELCOME_EMAIL,
      data: {
        metadata: {
          fname: fname,
        },
      },
    };
    this.sendEmail(emailDto);
  }

  // sendAuthorizationOtpEmail(email: string, otpType: OtpType, metadata: {}) {
  //   switch (otpType) {
  //     case OtpType.VERIFY_EMAIL:
  //       let verifyEmailDto: SendEmailDto = {
  //         to: email,
  //         subject: 'Verify your email address',
  //         template: MESSAGE_TEMPLATE.VERIFY_EMAIL,
  //         data: {
  //           metadata: metadata,
  //         },
  //       };
  //       this.sendEmail(verifyEmailDto);
  //       break;
  //     default:
  //       break;
  //   }
  // }

 
}
