import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [BlogController],
  providers: [BlogService],
    imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
  
})

export class BlogModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AccessTokenMiddleware)
    .forRoutes(
        { path: 'blogs*', method: RequestMethod.POST },      // Matches localhost:3600/orders/
    )
  }
}