import { Module ,MiddlewareConsumer,RequestMethod} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";
import { FileService } from 'src/helpers/upload';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService,FileService],
  imports: [AuthModule,MongooseModule.forFeature(forFeatureDb)],

})

export class ItemsModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'items*',method:RequestMethod.ALL})
  }
}