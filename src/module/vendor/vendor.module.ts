import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [VendorController],
  providers: [VendorService,],
  imports: [AuthModule,MongooseModule.forFeature(forFeatureDb),ErrorFormat],

})
export class VendorModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'vendors',method:RequestMethod.ALL})
  }
}
