import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';
import { CartService } from '../cart/cart.service';
import { StripePayment } from 'src/helpers/stripePayment';
import { ItemsService } from '../items/items.service';
import { VendorModule } from '../vendor/vendor.module';


@Module({
  controllers: [OrderController],
  // exports:[forwardRef(() =>VendorModule)],
  exports:[OrderService],
  providers: [OrderService,CartService,StripePayment,ItemsService],
  imports: [MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => AuthModule),
    forwardRef(() => VendorModule),

    ],
})


export class OrderModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'orders*', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    )
  }
}

