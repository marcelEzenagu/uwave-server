import { FreightReceiptService } from './freight_receipt.service';
import { FreightReceiptController } from './freight_receipt.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FreightReceiptController],
  providers: [FreightReceiptService],
  imports:[
    forwardRef(() => AuthModule),

    MongooseModule.forFeature(forFeatureDb),

  ]
})
export class FreightReceiptModule {  configure(consumer:MiddlewareConsumer){
  consumer.apply(AccessTokenMiddleware)
  .forRoutes({path:'freight-receipts*',method:RequestMethod.ALL})
}
}
