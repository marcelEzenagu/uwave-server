import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSubCategoryService } from './product-sub-category.service';
import { CreateProductSubCategoryDto } from './dto/create-product-sub-category.dto';
import { UpdateProductSubCategoryDto } from './dto/update-product-sub-category.dto';
import { ProductSubCategory } from './entities/product-sub-category.entity';

@Controller('product-sub-category')
export class ProductSubCategoryController {
  constructor(private readonly productSubCategoryService: ProductSubCategoryService) {}

  


  
}
