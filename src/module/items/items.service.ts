import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './entities/item.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}


  async create(createItemDto: Item) {
    try{

      const newProduct = new this.itemModel(createItemDto)
      return await newProduct.save()
     }catch(e){
       console.log("error:: ",e)
      throw new BadRequestException(this.formatErrors(e))
     }  
  }

  async decreaseItem(items:Item[]) {
    try{
      const updatedItems: Item[] = [];

      for (const { productID, quantity } of items) {
        const updatedItem = await this.itemModel.findOneAndUpdate(
          { _id: productID, quantity: { $gte: quantity } },  // Ensure sufficient stock is available
          { $inc: { quantity: -quantity } },               // Atomically decrement the quantity
          { new: true }  
        )
        
        if (!updatedItem) {
          throw new Error('Not enough quantity available.');
        }     
        updatedItems.push(updatedItem)
      }
      return updatedItems;

    }catch(e){
       console.log("error:: ",e)
      throw new BadRequestException(this.formatErrors(e))
     }  
  }

  async findAll(where:{}) {
try{
    return await  this.itemModel.find().where(where).exec();
  }catch(e){
    console.log("error:: ",e)
   throw new BadRequestException(this.formatErrors(e))
  }  }
  

  async findOne(id: string):Promise<Item> {
    try{
    return await  this.itemModel.findById(id).exec();
  }catch(e){
    console.log("error:: ",e)
   throw new BadRequestException(this.formatErrors(e))
  }  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try{

    
    return await  this.itemModel.findByIdAndUpdate(id, updateItemDto, {new: true})
  }catch(e){
    console.log("error:: ",e)
   throw new BadRequestException(this.formatErrors(e))
  }  
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  formatErrors(error: any) {
    console.log("ERROR:: ",error.name)

    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
       return `an item with this vendorID, productID and itemName combination already exists`;
 
     }else{
       const formattedErrors = [];
       for (const key in error.errors) {
         if (error.errors.hasOwnProperty(key)) {
           formattedErrors.push({
             field: key,
             message: error.errors[key].message,
           });
         }
       }
       return formattedErrors;
 
     }
 
   }
}
