import { Controller, Get,Req, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreightService } from './freight.service';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { Request } from 'express';

@Controller('freights')
export class FreightController {
  constructor(private readonly freightService: FreightService) {}

  @Post()
  create(@Body() createFreightDto: CreateFreightDto,
  @Req() req: Request,

) {
  const userID = req['user'].sub;
  createFreightDto.userID = userID
    return this.freightService.create(createFreightDto);
  }

  @Get()
  findAll() {
    return this.freightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string,
  @Req() req: Request,
) {
  const userID = req['user'].sub;
  return this.freightService.findOne(userID,id);

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreightDto: UpdateFreightDto,
  @Req() req: Request,

) {
     const userID = req['user'].sub;

    return this.freightService.update(id, updateFreightDto);
  }


}
