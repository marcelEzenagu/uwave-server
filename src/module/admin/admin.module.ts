import { Module,forwardRef,MiddlewareConsumer,RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';
import { FreightService } from '../freight/freight.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService,UserService,ErrorFormat,ProductCategoryService,ProductSubCategoryService,FreightService],
  imports: [MongooseModule.forFeature(forFeatureDb),

    forwardRef(() => AuthModule),
  ],

})
export class AdminModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'admin*', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    )
  }
}
