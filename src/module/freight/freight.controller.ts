import { Controller, Get,Req,BadRequestException, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreightService } from './freight.service';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { Request } from 'express';
import { StripePayment } from 'src/helpers/stripePayment';


import { ApiTags } from '@nestjs/swagger';

@ApiTags('freights')
@Controller('freights')
export class FreightController {
  constructor(
    private readonly freightService: FreightService,

    private readonly stripeService: StripePayment,
  ) {}

  @Post()
  create(@Body() createFreightDto: CreateFreightDto, @Req() req: Request) {
    try {
      const { sub, role } = req['user'].sub;
      const userID = sub;

      createFreightDto.userID = userID;
        return this.freightService.create(createFreightDto);
    } catch (e) {
      console.log('ERROR:: ', e);
      throw e;
    }
  }

  
  @Post('pay-intent')
  async createPayIntent(
    @Body() createOrderDto: CreateFreightDto,
    @Req() req: Request,
  ) {
    try {
      const userID = req['user'].sub;
      createOrderDto.userID = userID;
      const intentRes = await this.stripeService.createSession(
        createOrderDto.totalCost,
      );
      createOrderDto.paymentIntentID = intentRes.paymentIntentID;
      createOrderDto.clientSecret = intentRes.clientSecret;
      intentRes.paymentIntentID = undefined;

      await this.freightService.create(createOrderDto);
      return intentRes;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  @Get()
  findAll() {
    let where = {};
    return this.freightService.findAll(where);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userID = req['user'].sub;
    return this.freightService.findOne(userID, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFreightDto: UpdateFreightDto,
    @Req() req: Request,
  ) {
    const userID = req['user'].sub;
    if (updateFreightDto.agreeToTerms === false) {
    }

    return this.freightService.update(id, updateFreightDto);
  }
}
