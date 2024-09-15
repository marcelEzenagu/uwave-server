import { MESSAGE_TEMPLATE } from '../../notification/enum';

export class SendEmailDto {
  subject: string;
  to: string;
  from?: string;
  otp?: string;
  data?: {
    metadata: {};
  };
  template: MESSAGE_TEMPLATE;
  
}