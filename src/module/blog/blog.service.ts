import { Injectable } from '@nestjs/common';
import { Blog ,BlogDocument} from './entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogService {
 constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogDocument>,
  ) {}

  async create(createBlogDto: Blog) {
    createBlogDto.design = JSON.stringify(createBlogDto.design)
    const newSavedItem = await new this.BlogModel(
      createBlogDto,
    ).save();

    return {data:newSavedItem,
      message:'This action adds a new blog'};
  }

  async findAll(where:any) {
    where.deletedAt = null
    return await  this.BlogModel.find().where(where).exec();
  }

  async adminFindAll(where:any) {
    where.deletedAt = null
    return await  this.BlogModel.find().exec();
  }

 async findOne(id: string) {
    const where = {"deletedAt":null,"_id":id}
    return await  this.BlogModel.findOne().where(where).exec();
  }
 async remove(id: string) {
    const where = {"deletedAt":null,"_id":id}
    return await  this.BlogModel.findOne().where(where).exec();
  }
 
}
