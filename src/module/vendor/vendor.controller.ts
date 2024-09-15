import { Controller,Req, Get, Post,HttpStatus, Body, Patch, Param, Delete, Res, BadRequestException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { Request } from 'express';
import { ResetPasswordDto } from '../auth/dto/reset.dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get('/details')
  findOne(@Req() req: Request) {
    try {
    const vendorID = req['user'].sub
    const role = req['user'].role

    if(role !="vendor"){
      throw new BadRequestException("unaccessible to non-vendors");
    }

    return this.vendorService.findOne(vendorID);
  } catch (e) {
    throw new BadRequestException(e);
  }
  }

  @Patch("")
  update(@Req() req: Request,
   @Body() updateVendorDto: UpdateVendorDto) {
    const role = req['user'].role
    if(role !="vendor"){
      throw new BadRequestException("unaccessible to non-vendors");
    }
    const vendorID = req['user'].sub
    try{
      return this.vendorService.update(vendorID,updateVendorDto);
    }catch(e){
      throw new BadRequestException(e)
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const userID = req['user'].sub;
    dto.vendorID = userID;

    return await this.vendorService.resetVendorPassword(dto);
  }

}