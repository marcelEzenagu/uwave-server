import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { Model,Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    
    
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

  async isOrderForUser(orderID,userID: string) {
    // const where = {userID,"_id":mongoose.Types.ObjectId(orderID)
    const objectId = new Types.ObjectId(orderID); // Convert string to ObjectId manually

    // const where = {userID,"_id":objectId}
    const where = {userID,"_id":orderID}

    const result = await this.orderModel.findOne(where).exec();
    console.log("WHERE:: ",where,"result:: ",result)
    
    // process.exit()
    if(result != undefined){
      console.log("HERE")
      
      return {success:true,result}
    }
    return {success:false}
    console.log("NHERE")
  }

  async findUserOrders(where: {}) {
    return await this.orderModel.find().where(where).exec();
  }

  async updatePayment(paymentIntentID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, paymentIntentID };
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }
  
  async update(orderID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, _id: orderID };
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }
  
  async updateStatus(orderID, userID: string, updateOrderDto: UpdateOrderDto) {
    const where = { userID, _id: orderID };

    const updatedStatus = {"status":updateOrderDto.status}
    return await this.orderModel.findOneAndUpdate(where, updateOrderDto, {
      new: true,
    });
  }

  async remove(where): Promise<any> {
    await this.orderModel.findOneAndDelete(where);
    return `This action removes a #${where?._id} order`;
  }

  async getVendorSales(vendorID: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    return await this.orderModel.aggregate([
      // Match orders that contain items for the given vendor and are within the last 7 days
      { 
        $match: { 
          'items.vendorID': vendorID,
          createdAt: { $gte: sevenDaysAgo }  // Only include orders from the last 7 days
        } 
      },
      
      // Unwind the items array to work with each item individually
      { $unwind: '$items' },
      
      // Group by vendorID and sum the total sales (quantity * price)
      { 
        $group: {
          _id: '$items.vendorID',
          totalSales: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          },
          orderCount: { $sum: 1 } // Count the number of orders
        }
      }
    ]);
  }
  
  async getAllVendorSales(vendorID: string) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    return await this.orderModel.aggregate([
      // Match orders that contain items for the given vendor and are within the last 7 days
      { 
        $match: { 
          'items.vendorID': vendorID,
          createdAt: { $gte: sevenDaysAgo }  // Only include orders from the last 7 days
        } 
      },
      
      // Unwind the items array to work with each item individually
      { $unwind: '$items' },
      
      // { $match: { 'items.vendorID': vendorID } },
      
      // Group by vendorID, sum total sales, and collect the ordered items
      { 
        $group: {
          _id: '$items.vendorID',
          totalSales: { 
            $sum: { $multiply: ['$items.quantity', '$items.price'] } 
          },
          orderCount: { $sum: 1 }, // Count the number of orders
          items: { $push: '$items' } // Collect all items belonging to the vendor
        }
      }
    ]);
  }
  
  
}
