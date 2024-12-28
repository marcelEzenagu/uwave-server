import {
  Controller,
  Get,
  Req,
  BadRequestException,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogDto: Blog, @Req() req: Request) {
    try {
      const { sub, role } = req['user'].sub;
      if (role != 'admin') {
        throw new BadRequestException('unaccessible');
      }
      createBlogDto.createdBy = role;

      return this.blogService.create(createBlogDto);
    } catch (e) {
      console.log('ERROR:: ', e);
      throw e;
    }
  }

  @Get()
  findAll(
        @Query('date') date?: string,
  ) {
    let where:any = {}

    if(date){
      where.date = date
    }
    return this.blogService.findAll(where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}