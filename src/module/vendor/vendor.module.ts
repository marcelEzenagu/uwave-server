import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AuthModule } from '../auth/auth.module';
import { FileService } from 'src/helpers/upload';
import { OrderModule } from '../order/order.module';
import { ItemsModule } from '../items/items.module';

@Module({
  controllers: [VendorController],
  exports:[VendorService],
  providers: [VendorService,FileService,ErrorFormat],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ItemsModule),
    MongooseModule.forFeature(forFeatureDb),OrderModule],
})

export class VendorModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'vendors*',method:RequestMethod.ALL})
  }
}
