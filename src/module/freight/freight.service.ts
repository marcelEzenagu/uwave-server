import { Injectable } from '@nestjs/common';
import { CreateFreightDto } from './dto/create-freight.dto';
import { UpdateFreightDto } from './dto/update-freight.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Freight,FreightDocument } from './entities/freight.entity';

@Injectable()
export class FreightService {
  constructor(
    @InjectModel(Freight.name) private freightModel: Model<FreightDocument>
    ) {}

  async create(createFreightDto: CreateFreightDto) {

  try{

    const newSavedItem = new this.freightModel(createFreightDto);
    return await newSavedItem.save();
   }catch(e){
    console.log("ERROR:: ",e)
    throw e
      }
  
  }

  async findAll(where:any) {
    where.deletedAt = null
    return await  this.freightModel.find().where(where).exec();
  }

  async adminFindAll() {
    return await this.freightModel.find().exec();
  }

  async findOne(userID,id: string) {
    const where = {"userID":userID,"_id":id}
    return await  this.freightModel.findOne().where(where).exec();
  }

  async update(id: string, updateFreightDto: UpdateFreightDto) {
    return await  this.freightModel.findByIdAndUpdate(id, updateFreightDto, {new: true})

  }
  async adminUpdate(id: string, UpdateFreightDto: UpdateFreightDto) {

    try{

    console.log("paymentStatus:::: ",UpdateFreightDto,id)
    const where = {
      _id:id
    }
    return await this.freightModel.findOneAndUpdate(where,UpdateFreightDto,{new:true})
  }catch(e){
    console.log("ERROR:: ",e)
    throw new Error(e)
  }
  }

 
}
