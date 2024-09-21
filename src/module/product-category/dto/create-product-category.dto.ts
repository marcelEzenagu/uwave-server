import { PartialType } from '@nestjs/mapped-types';
import { ProductCategory } from '../entities/product-category.entity';

export class CreateProductCategoryDto extends PartialType(ProductCategory) {}