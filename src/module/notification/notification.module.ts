import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
// import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
// import { SmsModule } from 'src/sms/sms.module';
import { MailerService } from '../mailer/mailer.service';

@Module({
  exports: [NotificationService],
  // imports: [SmsModule],
  providers: [NotificationService, MailerService],
})
export class NotificationModule {}
