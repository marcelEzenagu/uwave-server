import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument, ItemFilter, ItemStatus } from './entities/item.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { FileService } from 'src/helpers/upload';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>,

  private readonly fileService: FileService) {}


  async create(createItemDto: Item) {
    try{

      let newProduct = new this.itemModel(createItemDto)
      if(createItemDto.images){
        const vPath = "public/images/items"
        const productImages :string[] = []
        const imagePath = `${vPath}/${createItemDto.vendorID}/${createItemDto.itemName}`
        for(let i= 0; i < createItemDto.images.length; i++){
          const imageName =`${createItemDto.itemName}-${i}.png`
          await this.fileService.uploadImage(createItemDto.images[i],imagePath,imageName)
          
          const itemImage = `${imagePath}/${imageName}`
          productImages.push(itemImage)
  
        }
        
        createItemDto.images = productImages
      }

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
          { $inc: { quantity: -quantity, salesCount: +quantity } },               // Atomically decrement the quantity
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
    }   
  }

   async searchItem(query,country,filterTag: string) {
    query = query.trim()
    
  
    
    const filter: any = { $text: { $search: query },
      itemSupportedCountries:
      { $regex: new RegExp(`^${country}`, 'i')}
    };


  var sortOption :any = {}
  if(filterTag == ItemFilter.BEST_SELLER){
    sortOption.salesCount = -1; // Sort bestsellers first
  }else if(filterTag == ItemFilter.HIGH_TO_LOW){
    sortOption.salesPrice = -1; // Sort by price high to low

  }else if(filterTag == ItemFilter.LOW_TO_HIGH){
    sortOption.salesPrice = 1; // Sort by price low to high

  }

    return await  this.itemModel.find(filter).sort(sortOption).exec();

  }
  

   async searchItemByVendors(query,vendorID: string,daysDifference:number,status?:ItemStatus) {
    query = query.trim()

    const endDate = new Date(); // Current date
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysDifference);
    
    const filter: any = { $text: { $search: query },
    vendorID,
    createdAt: {
      $lte: endDate, // greater than or equal to startDate
      $gte: startDate,   // less than or equal to endDate
    },
    // status
      // { $regex: new RegExp(`^${vendorID}`, 'i')}
    };
    if (status){
      filter.status = status
      console.log("status__STATTUS:::::> ")
    }
console.log("STATTUS:::::> ",filter)
// process.exit()

  var sortOption :any = {}
  // if(filterTag == ItemFilter.BEST_SELLER){
  //   sortOption.salesCount = -1; // Sort bestsellers first
  // }else if(filterTag == ItemFilter.HIGH_TO_LOW){
  //   sortOption.salesPrice = -1; // Sort by price high to low
  // }else if(filterTag == ItemFilter.LOW_TO_HIGH){
  //   sortOption.salesPrice = 1; // Sort by price low to high
  // }

  
    return await  this.itemModel.find(filter).sort(sortOption).exec();

  }
  

  async findOne(id: string):Promise<Item> {
    try{
      return await  this.itemModel.findById(id).exec();
    }catch(e){
      console.log("error:: ",e)
    throw new BadRequestException(this.formatErrors(e))
    }  
  }


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
