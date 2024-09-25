import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('')
export class StatusController {
  constructor(
 
  ) {}


  @Get('success')
  getSuccess(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'success.html'));
  }

  
  @Get('fail')
  getFail(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'fail.html'));
  }
 
}
