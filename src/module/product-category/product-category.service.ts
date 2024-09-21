import { Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory,ProductCategoryDocument } from './entities/product-category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,

  ){}

  async create(createProductCategoryDto: ProductCategory) {
    try{
      const newCategory = new this.productCategoryModel(createProductCategoryDto);
      return await newCategory.save();
    }catch(e){
      throw new Error(e)
    }
  }

  async findAll() {
    try{
      return await this.productCategoryModel.find().exec();
    }catch(e){
      throw new Error(e)
    }  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }


  async findWhere(where: {}): Promise<ProductCategory> {
    try{
      return await this.productCategoryModel.findOne().where(where).exec();
    }catch(e){
      throw new Error(e)
    }
  }

  async update(ID: string, updateProductSubCategoryDto: UpdateProductCategoryDto) {
    try{
      const where = { "productSubCategoryID": ID };
      return await this.productCategoryModel.findOneAndUpdate(where, updateProductSubCategoryDto, {
        new: true,
      });
    }catch(e){
      throw new Error(e)
    }
  }

  async remove(where):Promise<any> {
    try{
      await this.productCategoryModel.findOneAndDelete(where);
      return `This action removes a #${where?._id} productSubCategory`;
    }catch(e){
      throw new Error(e)
    }
  }
 
}
