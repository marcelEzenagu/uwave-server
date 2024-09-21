import { Injectable } from '@nestjs/common';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategory,ProductSubCategoryDocument } from './entities/product-sub-category.entity';
import { Model,Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

@Injectable()
export class ProductSubCategoryService {
  constructor(
    @InjectModel(ProductSubCategory.name) private productSubCategoryModel: Model<ProductSubCategoryDocument>,

  ){}


async create(createProductSubCategoryDto: ProductSubCategory) {
  try{
    const newProdSub = new this.productSubCategoryModel(createProductSubCategoryDto);
    return await newProdSub.save();
  }catch(e){
    throw new Error(e)
  }
}


async findAll() {
  try{
    return await this.productSubCategoryModel.find().exec();
  }catch(e){
    throw new Error(e)
  }
}


findOne(id: number) {
  return `This action returns a #${id} productSubCategory`;

}


async findWhere(where: {}): Promise<ProductSubCategory> {
 try{
    return await this.productSubCategoryModel.findOne().where(where).exec();
  }catch(e){
    throw new Error(e)
  }
}


async update(ID: string, updateProductSubCategoryDto: UpdateProductSubCategoryDto) {
  try{
    const where = { "productSubCategoryID": ID };
    return await this.productSubCategoryModel.findOneAndUpdate(where, updateProductSubCategoryDto, {
      new: true,
    });
  }catch(e){
    throw new Error(e)
  }
}


async remove(where):Promise<any> {
  try{
    await this.productSubCategoryModel.findOneAndDelete(where);
    return `This action removes a #${where?._id} productSubCategory`;
  }catch(e){
    throw new Error(e)
  }
  }


}