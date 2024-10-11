import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product, ProductStatus } from './entities/product.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Console } from 'console';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}


  async create(createProductDto: Product) {
    createProductDto.productName = createProductDto?.productName?.toLowerCase()
    createProductDto.productCategory = createProductDto?.productCategory?.toLowerCase()
    createProductDto.productSubCategory = createProductDto?.productSubCategory?.toLowerCase()

     const newProduct = new this.productModel(createProductDto)
     return await newProduct.save()
  
  }

  async findAll(where:{}) {
     where={"deletedAt":null}

    return await  this.productModel.find().where(where).exec();
  }

  

  async adminGetProductsByStatusAndRange(page,limit :number, status:ProductStatus,start,end,search:string) {
   
    const skip = (page - 1) * limit;

    
    const startDate = new Date(start);  // Start of the range
    const endDate = new Date(end);      // End of the range

      
      const filter: any = { }
    
    if(status){

      filter.status = status
    }

    if(search){
      const regex = new RegExp(search, 'i'); // 'i' for case-insensitive matching

      filter.$or = [
        { productName: { $regex: regex } },    // Match `product.name` with regex
        {vendorID: { $regex: regex } },                 // Match `orderID` with regex
      ];
    }  

    if (start || end) {

      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = startDate;  // Filter by start date
      }
      if (endDate) {
        filter.createdAt.$lte = endDate;    // Filter by end date
      } 

    }


    const data = await this.productModel.find(filter)
                                        .skip(skip)
                                        .limit(limit)
                                        .exec();
  
    const total = await this.productModel.countDocuments();

    return {
      data,total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)

    }
  }

  async findOne(id):Promise<Product> {

    return await  this.productModel.findById(id).exec();
  }
  
  async findWhere(where:any):Promise<Product> {
    where.deletedAt = null
    return await  this.productModel.findOne().where(where).exec();
  }

  async update(id: string, updateProductDto: Product):Promise<Product> {
  const filter = {"deletedAt":null,"productID":id}
  return await  this.productModel.findOneAndUpdate(filter, updateProductDto, {new: true})
}



async remove(id: string) {
  const filter = {"deletedAt":null,"productID":id}
  const updateProductDto = {"deletedAt":new Date}
  await  this.productModel.findOneAndUpdate(filter, updateProductDto, {new: true})
    return `This action removes a #${id} product`;
  }



}
