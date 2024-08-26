import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
})

export class CartModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'carts*',method:RequestMethod.ALL})
  }
}