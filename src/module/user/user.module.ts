import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { FileService } from 'src/helpers/upload';
import { ErrorFormat } from 'src/helpers/errorFormat';

@Module({
  controllers: [UserController],
  providers: [UserService,FileService,ErrorFormat],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
})

export class UserModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'users*',method:RequestMethod.ALL})
  }
}
