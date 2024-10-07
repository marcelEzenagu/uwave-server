import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product } from './entities/product.entity';
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

  async findOne(id):Promise<Product> {

    return await  this.productModel.findById(id).exec();
  }
  
  async findWhere(where:any):Promise<Product> {
    where.deletedAt = null
    return await  this.productModel.findOne().where(where).exec();
    // return await  this.productModel.findById(id).exec();
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
