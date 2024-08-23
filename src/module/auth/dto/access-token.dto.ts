export class AccessTokenDto {
  access_token: string;
  role?: string;
}

export class AccessTokenResDto {
  message: string;
  data: AccessTokenDto;
}
