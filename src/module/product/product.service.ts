import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product } from './entities/product.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';

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



}
