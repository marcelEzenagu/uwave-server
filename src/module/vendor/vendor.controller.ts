import { Controller, Get, Post,HttpStatus, Body, Patch, Param, Delete, Res, BadRequestException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { ErrorFormat } from 'src/helpers/errorFormat';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Res() response, @Body() createVendorDto: Vendor) {
    try{
      console.log("createVendorDto===>",createVendorDto)
      const newVendor = await this.vendorService.create(createVendorDto);
      return response.status(HttpStatus.CREATED).json({
        newVendor
      })
    }catch(e){
      throw new BadRequestException(this.vendorService.formatErrors(e));
    }
  
  }
  

  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: Vendor) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(+id);
  }
}
