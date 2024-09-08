import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SavedItemsService } from './saved-items.service';
import { SavedItemsController } from './saved-items.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [SavedItemsController],
  providers: [SavedItemsService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],

})
export class SavedItemsModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'saved-items*', method: RequestMethod.ALL },      // Matches localhost:3600/orders/
    )
  }
}
