import { Module ,forwardRef,MiddlewareConsumer,RequestMethod} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { FileService } from 'src/helpers/upload';
import { OrderModule } from '../order/order.module';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AdminModule } from '../admin/admin.module';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService,FileService,ErrorFormat],
  imports: [MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => OrderModule),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
  ],
  exports:[ItemsService]
})

export class ItemsModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .exclude(
      { path: 'items/search', method: RequestMethod.GET } , // Exclude this specific route
      { path: 'items/:id', method: RequestMethod.GET },  // Exclude this specific route
      { path: 'items', method: RequestMethod.GET }  // Exclude this specific route
    )
    .forRoutes({path:'items*',method:RequestMethod.ALL})
    
  }
}