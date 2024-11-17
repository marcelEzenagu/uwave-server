import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,Query,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OptionType, PaymentStatusType } from './entities/order.entity';
import { Request } from 'express';
import { StripePayment } from 'src/helpers/stripePayment';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private  errorFormat: ErrorFormat,

    private readonly stripeService: StripePayment,
  ) {}

  @Post()
  async create(@Body() updateOrderDto: UpdateOrderDto,
  @Req() req: Request
) {

  console.log("updateOrderDto::: ",updateOrderDto)

  // return
    try {
      // change amount to cent for
      // include paymentIntentID, clientSecret and paymentStatus
      // check using the URL that payment on stripe is successful;
      // check db that the client Secret is not with paymentStatus as successful;
      
      // check using the URL

     const userID = req['user'].sub;
   
     const paymentIntentID = updateOrderDto.clientSecret.split("_secret")[0]
    
     const existingOrder = await this.orderService.findWhere(paymentIntentID);
      if(existingOrder.paymentStatus == PaymentStatusType.SUCCESS ){
        throw new BadRequestException("order already completed.");
      } 
      updateOrderDto.totalCost = undefined
      updateOrderDto.status = undefined
      
     return await this.orderService.updatePayment(paymentIntentID, userID, updateOrderDto);
    }catch(e){
      console.log("e.CastError",e.CastError)
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

  @Post("pay-intent")
  async createPayIntent(@Body() createOrderDto: CreateOrderDto,
  @Req() req: Request
) {

    try {

      console.log("GOT CALLED-intent")
      const userID = req['user'].sub;
      createOrderDto.userID = userID
      console.log("createOrderDto:::",createOrderDto)

      const intentRes = await this.stripeService.createSession(createOrderDto.totalCost)
      console.log("GOT intentRes",intentRes)

      createOrderDto.paymentIntentID =intentRes.paymentIntentID
      createOrderDto.clientSecret =intentRes.clientSecret
      intentRes.paymentIntentID =undefined

      await this.orderService.create(createOrderDto);
      return intentRes;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get()
  findAll(

    @Query('vendorID') vendorID?: string,
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 50 
  ) {
    let where :any = {}
    if (vendorID)where.vendorID = vendorID

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;  // Page should be at least 1
    if (limit < 1 || limit > 100) limit = 10;  // Limit should be between 1 and 100

    return this.orderService.findAll(page,limit,where);
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