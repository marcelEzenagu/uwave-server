import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductSubCategoryService } from './product-sub-category.service';
import { ProductSubCategoryController } from './product-sub-category.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';

@Module({
  // controllers: [ProductSubCategoryController],
  providers: [ProductSubCategoryService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],

})


export class ProductSubCategoryModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: '', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
        // { path: 'orders/*', method: RequestMethod.ALL },    // Matches localhost:3600/orders/:id
    )
  }
}
