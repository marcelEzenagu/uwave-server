import { Injectable } from '@nestjs/common';
import { CreateSavedItemDto } from './dto/create-saved-item.dto';
import { UpdateSavedItemDto } from './dto/update-saved-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { SavedItem, SavedItemDocument } from './entities/saved-item.entity';

@Injectable()
export class SavedItemsService {

  constructor(

    @InjectModel(SavedItem.name) private savedItemsModel: Model<SavedItemDocument>,
  ){}

  create(createSavedItemDto: CreateSavedItemDto) {
    return 'This action adds a new savedItem';
  }
  async saveItem(createSavedItemDto: CreateSavedItemDto) {

    const where = {"userID":createSavedItemDto.userID,"productID":createSavedItemDto.productID}
    const result= await  this.savedItemsModel.findOne().where(where).exec();
    if (result == undefined){
      
    const newSavedItem = new this.savedItemsModel(createSavedItemDto);
    return newSavedItem.save();
    }else{
  return result
    }
  }

  async removeItem(where) {
      
      await this.savedItemsModel.findOneAndDelete(where);
      return `This action removes a #${where?._id}  savedItem`;
    
  }

  async findAllUserSavedItem(where) {
    return await this.savedItemsModel.find().where(where).exec();
  }
 

 

 
  

  remove(id: number) {
    return `This action removes a #${id} savedItem`;
  }
}
