import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { CategoryStatus, ProductCategory,ProductCategoryDocument } from './entities/product-category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ErrorFormat } from 'src/helpers/errorFormat';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory.name) 
    private productCategoryModel: Model<ProductCategoryDocument>,
    private errorFormat: ErrorFormat,

  ){}

  async create(createProductCategoryDto: ProductCategory) {
    try{
      const newCategory = new this.productCategoryModel(createProductCategoryDto);
      return await newCategory.save();
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

  async findAll(where:{}) {
    try{


      return await this.productCategoryModel.find().where(where).exec();
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }


  async findWhere(where: {}): Promise<ProductCategory> {
    try{
      return await this.productCategoryModel.findOne().where(where).exec();
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

  async update(ID: string, updateProductSubCategoryDto: UpdateProductCategoryDto):Promise<ProductCategory> {
    try{
      const where = { "_id": ID };
      return await this.productCategoryModel.findOneAndUpdate(where, updateProductSubCategoryDto, {
        new: true,
      });
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }
  
  async remove(where):Promise<any> {
    try{
      let foundCat = await this.productCategoryModel.findById(where);
      foundCat.deletedAt = new Date()
       await this.productCategoryModel.findByIdAndUpdate(where, foundCat, {new:true})
      return `This action removes a #${where?._id} productSubCategory`;
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
}
 


  async adminSearchCategories(page,limit :number, status:CategoryStatus,search:string) {
    
    const skip = (page - 1) * limit;

    
  
    const filter: any = { } 
  
    if (search) {
      filter.categoryName = { $regex: search, $options: 'i' }; // 'i' makes it case-insensitive
    }
    
    if (status) {
     filter.status =status
    }

    const data = await this.productCategoryModel.find(filter)
                                        .skip(skip)
                                        .limit(limit)
                                        .exec();

    const total = await this.productCategoryModel.countDocuments();
    return {
      data,total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

}
