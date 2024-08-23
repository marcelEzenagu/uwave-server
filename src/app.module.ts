import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';
import { VendorModule } from './module/vendor/vendor.module';
import { AdminModule } from './module/admin/admin.module';
import { ProductModule } from './module/product/product.module';
import { OrderModule } from './module/order/order.module';
import { AuthModule } from './module/auth/auth.module';
import { CartModule } from './module/cart/cart.module';
import { LogisticsModule } from './module/logistics/logistics.module';
import forFeatureDb from './db/for-feature.db';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './helpers/new'
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.URI,),
            MongooseModule.forFeature(forFeatureDb),
    UserModule, VendorModule, AdminModule, ProductModule, OrderModule, AuthModule, CartModule, LogisticsModule],

    providers:[
      // {
      //   provide: APP_FILTER,
      //   useClass: AllExceptionsFilter,
      // },
    ],

    controllers: [HealthController]
})
export class AppModule {}
