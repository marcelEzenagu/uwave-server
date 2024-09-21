import { PartialType } from '@nestjs/mapped-types';
import { ProductSubCategory } from '../entities/product-sub-category.entity';

export class CreateProductSubCategoryDto extends PartialType(ProductSubCategory) {}