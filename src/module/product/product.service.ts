import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product } from './entities/product.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}


  create(createProductDto: Product) {
    const newProduct = new this.productModel(createProductDto)
    return newProduct.save()
  }

  async findAll() {
    return await  this.productModel.find().exec();
  }

  async findOne(id):Promise<Product> {
    return await  this.productModel.findById(id).exec();
  }
  
  async findWhere(where:{}):Promise<Product> {
    return await  this.productModel.findOne().where(where).exec();
    // return await  this.productModel.findById(id).exec();
  }

  async update(id: number, updateProductDto: Product):Promise<Product> {
    return await  this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true})
  }
  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  formatErrors(error: any) {
    console.log("ERROR:: ",error.name)

    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
       return `Duplicate value for field: ${field}`;
 
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
