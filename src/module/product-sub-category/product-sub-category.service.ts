import { Injectable } from '@nestjs/common';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategory,ProductSubCategoryDocument } from './entities/product-sub-category.entity';
import { Model,Types,FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';
import { CategoryStatus } from '../product-category/entities/product-category.entity';

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


async findAll(where) {
  try{

    const query: FilterQuery<ProductSubCategoryDocument> = {};

    // where by productCategory (ObjectId)
    if (where.productCategory) {
      query.productCategory = where.productCategory; // Should be an ObjectId
    }

    // where out deleted entries (optional)
    if (!where.includeDeleted) {
      query.deletedAt = { $eq: null }; // Only include not deleted (null) entries
    }
    return await this.productSubCategoryModel.find().where(where)
              .populate({
                path: 'productCategory',  // Populate the referenced field
                select: 'name',            // Select only the 'name' field
              })
              .exec();
  }catch(e){
    throw new Error(e)
  }
}

// async findAll(where) {
//   try{
//     console.log("where:: ",where)
//     return await this.productSubCategoryModel.find().where(where).populate("productCategoryID").exec();
//   }catch(e){
//     throw new Error(e)
//   }
// }


findOne(id: number) {
  return `This action returns a #${id} productSubCategory`;

}


async findWhere(where: any): Promise<ProductSubCategory> {

  where.status = CategoryStatus.ACTIVE
  try{
    return await this.productSubCategoryModel.findOne()
    .where(where)
    .populate({
      path: 'productCategory',  // Populate the referenced field
      select: 'name',            // Select only the 'name' field
    })
    .exec();
  }catch(e){
    throw new Error(e)
  }
}


async update(ID: string, updateProductSubCategoryDto: UpdateProductSubCategoryDto) {
  try{
    const where = { "_id": ID };
    return await this.productSubCategoryModel.findOneAndUpdate(where, updateProductSubCategoryDto, {
      new: true,
    });
  }catch(e){
    throw new Error(e)
  }
}


async remove(where):Promise<any> {
  // where.status = CategoryStatus.ACTIVE

  try{

    let foundCat = await this.productSubCategoryModel.findById(where);
    foundCat.deletedAt = new Date()
    await this.productSubCategoryModel.findByIdAndUpdate(where, foundCat, {new:true})
    return `This action removes a #${where?._id} productSubCategory`;
  }catch(e){
    throw new Error(e)
  }
  }


  async adminSearchSubCategories(page,limit :number, status:CategoryStatus,search:string) {
    
    const skip = (page - 1) * limit;

    
  
    const filter: any = {}
    
    if (search) {
      filter.subCategoryName = { $regex: search, $options: 'i' }; 
      
    }
    
    if (status) {
     filter.status =status
    }
    // status,   
    //   $text: { $search: search? search:null },
    // }



    const data = await this.productSubCategoryModel.find(filter)
                                        .skip(skip)
                                        .limit(limit)
                                        .exec();

    const total = await this.productSubCategoryModel.countDocuments();
    return {
      data,total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }


}