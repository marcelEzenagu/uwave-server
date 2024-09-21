import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSubCategoryService } from './product-sub-category.service';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategory } from './entities/product-sub-category.entity';

@Controller('product-sub-category')
export class ProductSubCategoryController {
  constructor(private readonly productSubCategoryService: ProductSubCategoryService) {}

  @Post()
  create(@Body() createProductSubCategoryDto: ProductSubCategory) {
    return this.productSubCategoryService.create(createProductSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.productSubCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSubCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductSubCategoryDto: UpdateProductSubCategoryDto) {
    return this.productSubCategoryService.update(id, updateProductSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSubCategoryService.remove(+id);
  }
}
