import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './entities/product-category.entity';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post()
  create(@Body() createProductCategoryDto: ProductCategory) {
    return this.productCategoryService.create(createProductCategoryDto);
  }
  @Get()
  listAll(@Body() createProductCategoryDto: ProductCategory) {
    
    return this.productCategoryService.findAll();
  }

 
  @Patch(":id")
  async updateCategory(@Param('id') id: string, @Body() updateAdminDto: UpdateProductCategoryDto) {
    return await this.productCategoryService.update(id, updateAdminDto);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(+id);
  }

}