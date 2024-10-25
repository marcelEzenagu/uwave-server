import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';
import { ErrorFormat } from 'src/helpers/errorFormat';

@Module({
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService,ErrorFormat],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],

})

export class ProductCategoryModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    // .forRoutes(
    //     { path: '', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    //     // { path: 'orders/*', method: RequestMethod.ALL },    // Matches localhost:3600/orders/:id
    // )
  }
}
