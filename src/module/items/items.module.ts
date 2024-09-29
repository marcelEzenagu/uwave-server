import { Module ,forwardRef,MiddlewareConsumer,RequestMethod} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { FileService } from 'src/helpers/upload';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService,FileService],
  imports: [MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => OrderModule),
    forwardRef(() => AuthModule),
  ],
exports:[ItemsService]
})

export class ItemsModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'items*',method:RequestMethod.ALL})
  }
}