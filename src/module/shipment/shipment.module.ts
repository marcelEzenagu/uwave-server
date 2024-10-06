import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],

})
export class ShipmentModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'shipment*', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    )
  }
}
