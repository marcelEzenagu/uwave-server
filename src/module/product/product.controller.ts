import { Controller,Query,BadRequestException, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ErrorFormat } from 'src/helpers/errorFormat';


import { ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly errorFormat: ErrorFormat

  ) {}

  @Post()
  async create(@Body() createProductDto: Product) {
    try {
    
      return await this.productService.create(createProductDto);

    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
  
    }
  }

  @Get()
  findAll(
    @Query('subCategory') subCategory?: string,
    @Query('category') category?: string
  ) {

    let where :any = {}

    if (category)where.productCategory = category.toLowerCase()
    if(subCategory)where.productSubCategory = subCategory.toLowerCase()

    return this.productService.findAll(where);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const where = {"productID":id}
    return this.productService.findWhere(where);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Product) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
