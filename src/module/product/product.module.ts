import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { ErrorFormat } from 'src/helpers/errorFormat';

import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService,ErrorFormat],
  imports: [AuthModule,MongooseModule.forFeature(forFeatureDb)],

})
export class ProductModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'products',method:RequestMethod.ALL})
  }
}
