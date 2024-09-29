import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { FreightService } from './freight.service';
import { FreightController } from './freight.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from '../auth/auth.module';
import { StripePayment } from 'src/helpers/stripePayment';

@Module({
  controllers: [FreightController],
  providers: [FreightService,StripePayment],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],

})

export class FreightModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'freights*', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    )
  }
}
