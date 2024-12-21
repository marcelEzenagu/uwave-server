import { Controller,Req, Get, Post, Body, Patch, Param, Delete, BadRequestException,Res } from '@nestjs/common';
import { FreightReceiptService } from './freight_receipt.service';
import { CreateFreightReceiptDto } from './dto/create-freight_receipt.dto';
import { UpdateFreightReceiptDto } from './dto/update-freight_receipt.dto';
import { FreightReceipt } from './entities/freight_receipt.entity';
import { Request,Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
3
@Controller('freight-receipts')
export class FreightReceiptController {
  constructor(private readonly freightReceiptService: FreightReceiptService) {}

 
  @Post('/admin')
  async adminCreate(@Body() adminCreateFreightDto: FreightReceipt, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const { sub, role } = req['user'];
      if(role !="admin"){
        throw new BadRequestException("unaccessible");
      }
      
      console.log("body",adminCreateFreightDto)
      // console.log("body.gst",adminCreateFreightDto.gst)
      // return

       const pdfFilePath = await this.freightReceiptService.adminCreate(adminCreateFreightDto);
       const pdf = path.resolve(__dirname,pdfFilePath)

       let file = fs.createReadStream(pdf);
       file.pipe(res);
      
    } catch (e) {
      console.log('ERROR:: ', e);
      throw e;
    }
  }
  

}
