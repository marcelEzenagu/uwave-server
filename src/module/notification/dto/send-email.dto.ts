import { MESSAGE_TEMPLATE } from '../enum';

export class SendEmailDto {
  subject: string;
  to: string;
  from?: string;
  data?: {
    metadata: {};
  };
  template: MESSAGE_TEMPLATE;
}
