import { NOTIFICATION_TYPE, MESSAGE_TEMPLATE } from '../enum';

export class CreateNotificationDto {
  type: NOTIFICATION_TYPE;
  messageTemplate?: MESSAGE_TEMPLATE;
  message?: string;
  recipient: string;
  metadata?: any;
  source: string;
}
