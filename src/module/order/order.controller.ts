import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { OptionType } from './entities/order.entity';
import { Request } from 'express';
import { StripePayment } from 'src/helpers/stripePayment';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripePayment,

    private  cart: CartService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto,
  @Req() req: Request
) {

    try {

      const userID = req['user'].sub;
      // await this.cart.removeCart(createOrderDto.cartID,userID)
      return this.orderService.create(createOrderDto);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Post("pay-intent")
  async createPayIntent(@Body() createOrderDto: CreateOrderDto,
  @Req() req: Request
) {

  // /http://localhost:3600/public/images/vendors/profilePicture/7f5b3938-6c19-4c09-8732-fbf654c0590c.png
  // http://localhost:3600/public/images/vendors/business/7f5b3938-6c19-4c09-8732-fbf654c0590c.png
    try {
      const intentRes = await this.stripeService.createSession(createOrderDto.totalCost)
      return intentRes;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  
  @Get('user')
  findUserOrders(@Req() req: Request) {
    try {
      const where = { userID: req['user'].sub };

      return this.orderService.findUserOrders(where);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const where = {
        _id: id,
      };
      return await this.orderService.findWhere(where);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Patch(':id')
  async update(
    @Param('id')
    id: string,
    @Req() req: Request,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const userID = req['user'].sub;


      const isOrderForUser = await this.orderService.isOrderForUser(id, userID);
      if (!isOrderForUser.success) {
        throw new Error('Invalid access');
      }
      if (isOrderForUser.result.status != OptionType.ACCEPTED){
        
        throw new Error('cannot modify order status at this point');
      }
      return await this.orderService.update(id, userID, updateOrderDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id/cancel')
  async cancelOrder(
    @Param('id')
    id: string,
    @Req() req: Request,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {

      const userID = req['user'].sub;
      const role = req['user'].role;


      if(role == "user"){
        const isOrderForUser = await this.orderService.isOrderForUser(id, userID);
          if (!isOrderForUser.success) {

          throw new Error('Invalid access');
        }
        if (isOrderForUser.result.status != OptionType.ACCEPTED){
        
          throw new Error('cannot modify order status at this point');
        }
        updateOrderDto.status=OptionType.CANCELLED
      }

      return await this.orderService.updateStatus(id, userID, updateOrderDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id')
    id: string,
    @Req() req: Request,
  ) {
    try {
      const userID = req['user'].sub;

      const isOrderForUser = await this.orderService.isOrderForUser(id, userID);
      if (!isOrderForUser) {
        throw new Error('Invalid access');
      }
      const where = {
        userID,
        _id: id,
      };
      return await this.orderService.remove(where);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
