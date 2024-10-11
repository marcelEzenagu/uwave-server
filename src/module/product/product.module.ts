import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { ErrorFormat } from 'src/helpers/errorFormat';

import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [ProductController],
  exports: [ProductService],
  providers: [ProductService,ErrorFormat],
  imports: [AuthModule,
    // forwardRef(() => AdminModule),
    MongooseModule.forFeature(forFeatureDb)],

})
export class ProductModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'products',method:RequestMethod.ALL})
  }
}
