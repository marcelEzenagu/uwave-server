import { Controller,Query,BadRequestException, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDocument,Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ErrorFormat } from 'src/helpers/errorFormat';


import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly errorFormat: ErrorFormat

  ) {}

  @Post()
  async create(@Body() createProductDto: Product) {
    try {
    console.log("createProductDto::: ",createProductDto)
      return await this.productService.create(createProductDto);

    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
  
    }
  }

  @Get()
  async findAll(
    @Query('subCategory') subCategory?: string,
    @Query('category') category?: string
  ) {

    let where :any = {}

    if (category)where.productCategory = category.toLowerCase()
    if(subCategory)where.productSubCategory = subCategory.toLowerCase()

    const res=  await this.productService.findAll(where);
    console.log("RESPONSE ",res)
    return res
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const where = {"productID":id}
    return await this.productService.findWhere(where);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: Product) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
