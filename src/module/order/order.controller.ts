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

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return this.orderService.create(createOrderDto);
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
      if (!isOrderForUser) {
        console.log('NOT');
        throw new Error('Invalid access');
      }
      console.log('yes');
      return await this.orderService.update(id, userID, updateOrderDto);
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
