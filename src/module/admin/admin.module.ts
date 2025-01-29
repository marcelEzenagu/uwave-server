import {
  Module,
  forwardRef,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import forFeatureDb from 'src/db/for-feature.db';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { FreightService } from '../freight/freight.service';
import { UserService } from '../user/user.service';
import { VendorService } from '../vendor/vendor.service';
import { ItemsService } from '../items/items.service';
import { ItemsModule } from '../items/items.module';
import { FileService } from 'src/helpers/upload';
import { OrderService } from '../order/order.service';
import { VendorModule } from '../vendor/vendor.module';
import { OrderModule } from '../order/order.module';
import { AgentModule } from '../agent/agent.module';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { UtilityService } from 'src/helpers/utils';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    UserService,
    ErrorFormat,
    ProductService,
    ProductCategoryService,
    RedisService,
    MailerService,
    UtilityService,
    ProductSubCategoryService,
    FreightService,
    FileService,
  ],

  imports: [
    MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => AuthModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => VendorModule),
    forwardRef(() => OrderModule),
    forwardRef(() => AgentModule),
    // forwardRef(() => ProductCategoryModule),
  ],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessTokenMiddleware).forRoutes(
      { path: 'admin*', method: RequestMethod.ALL }, // Matches localhost:3600/orders/
    );
  }
}
