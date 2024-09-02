import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    console.log('createOrderDto:: ', createOrderDto);
    const newUserOrder = new this.orderModel(createOrderDto);
    return newUserOrder.save();
  }

  async findAll() {
    return await this.orderModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async findWhere(where: {}): Promise<Order> {
    return await this.orderModel.findOne().where(where).exec();
  }
  async isOrderForUser(orderID,userID: string): Promise<Boolean> {
    const where = {userID,"_id":orderID}
    const result = await this.orderModel.findOne().where(where).exec();
    if(result == undefined){
      return false
    }
  }

  async findUserOrders(where: {}) {
    return await this.orderModel.find().where(where).exec();
  }

  async update(orderID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, _id: orderID };
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }

  async remove(where): Promise<any> {
    await this.orderModel.findOneAndDelete(where);
    return `This action removes a #${where?._id} order`;
  }
}
