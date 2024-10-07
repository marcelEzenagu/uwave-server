import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ErrorFormat } from 'src/helpers/errorFormat';

@Module({
  controllers: [AdminController],
  providers: [AdminService,ErrorFormat,ProductCategoryService,ProductSubCategoryService],
  imports: [MongooseModule.forFeature(forFeatureDb)],

})
export class AdminModule {}
