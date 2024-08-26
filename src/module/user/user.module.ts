import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
})
export class UserModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes({path:'users*',method:RequestMethod.ALL})
  }
}
