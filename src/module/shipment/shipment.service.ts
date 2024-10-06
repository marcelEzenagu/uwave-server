import { Injectable } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Shipment, ShipmentDocument } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private shipmentModel: Model<ShipmentDocument>,

  ){}

  async create(createShipmentDto: Shipment) {
    const where = {"userID":createShipmentDto.agentID,"orderID":createShipmentDto.orderID}
    const result= await  this.shipmentModel.findOne().where(where).exec();
    if (result == undefined){
      const newSavedItem = new this.shipmentModel(createShipmentDto);
      return await newSavedItem.save();
    }else{
  return result
    }
  }

  findAll() {
    return `This action returns all shipment`;
  }

  findOne(id: number) {
  //   const or :Shipment= {
  //     numberOfItems:5,
  //     orderID:new Object("66f7f88818a0b464921aec79",
  //     agentID:"66fd26a0edeaf6f521204e9e",
  //     destination:"china"
  
  // })
  //   this.create(or )
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentDto: UpdateShipmentDto) {
    return `This action updates a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }

  async countShipmentsByStatus(vendorID: string): Promise<{ status: string, count: number }[]> {
    const result = await this.shipmentModel.aggregate([
      // Match shipments with the given vendorID
      {
        $match: { vendorID: vendorID }
      },
  
      // Group by status and count the number of shipments in each status
      {
        $group: {
          _id: "$status",         // Group by status field
          count: { $sum: 1 },     // Count the number of shipments with this status
        },
      },
  
      // Sort by the count in descending order (most common statuses first)
      {
        $sort: { count: -1 },
      },
  
      // Project the result to return status and count
      {
        $project: {
          _id: 0,                 // Exclude the _id field
          status: "$_id",         // Rename _id to status
          count: 1,               // Include the count
        },
      },
    ]);
    return result;
  }
  
}
