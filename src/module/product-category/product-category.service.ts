import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { CategoryStatus, ProductCategory,ProductCategoryDocument } from './entities/product-category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { ProductStatus } from '../product/entities/product.entity';
import { ProductSubCategory, ProductSubCategoryDocument } from '../product-sub-category/entities/product-sub-category.entity';
import { RedisService } from '../redis/redis.service';
// import { ProductSubCategoryDocument } from '../product-sub-category/entities/product-sub-category.entity';

@Injectable()
export class ProductCategoryService {
  static redisKey = "categories"

  constructor(
    private errorFormat: ErrorFormat,
    private redisService: RedisService,
    
    @InjectModel(ProductCategory.name) private productCategoryModel: Model<ProductCategoryDocument>,
    @InjectModel(ProductSubCategory.name) private subCategoryModel: Model<ProductSubCategoryDocument>,
    
  ){

  }

  async create(createProductCategoryDto: ProductCategory) {
    try{
      const newCategory = new this.productCategoryModel(createProductCategoryDto);
      
      await this.redisService.remove(ProductCategoryService.redisKey)
      return await newCategory.save();
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }
  }

  async adminFindAll(where:{}) {
    try{


      return await this.productCategoryModel.find().where(where).exec();
    }catch(e){
      throw new BadRequestException(this.errorFormat.formatErrors(e))
    }  }

  async findAll() {
    try{
      const where = {"deletedAt":null,
        status:ProductStatus.ACTIVE
      }
      const redisCategories = await this.redisService.getValue(ProductCategoryService.redisKey)     
    if(!redisCategories){

    const categories = await this.productCategoryModel.find(where).exec();

    const subCategories = await this.subCategoryModel.find(where).exec();


        const groupedCategories = categories.map(category => {
          // Filter subcategories that belong to the current category
          const subcat = subCategories
            .filter(sub => sub.productCategory.toString() === category._id.toString())
            .map(sub => ({
              id: sub._id,  
              name: sub.subCategoryName,  
            }));
    
          return {
            id: category._id,  
            name: category.categoryName, 
            image: category.categoryImage, 
            subcat: subcat,  
          };
        });
        
        await this.redisService.setTimedValue(ProductCategoryService.redisKey,JSON.stringify(groupedCategories),60*60*24)
        return groupedCategories
    }else{
      return JSON.parse(redisCategories)
    }
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
 
  async adminDelete(where):Promise<any> {
    try{
      // let foundCat = await this.productCategoryModel.findById(where);
      // foundCat.deletedAt = new Date()
       await this.productCategoryModel.findOneAndDelete(where)
      return `This action deletes a #${where?._id} productCategory`;
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
      // totalPages: Math.ceil(total / limit)
    }
  }

}
