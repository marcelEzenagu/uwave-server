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
import { SavedItemsModule } from './module/saved-items/saved-items.module';
import { UWaveUserModule } from './module/u-wave-user/u-wave-user.module';
import { UWaveAdminModule } from './module/u-wave-admin/u-wave-admin.module';
import { FreightModule } from './module/freight/freight.module';
import { RedisModule } from './module/redis/redis.module';
import { MailerModule } from './module/mailer/mailer.module';
import { NotificationModule } from './module/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.URI,),
    MongooseModule.forFeature(forFeatureDb),
    UserModule,MailerModule,NotificationModule, VendorModule,
    ProductModule, OrderModule, AuthModule, AdminModule,
    CartModule, LogisticsModule, SavedItemsModule,
    UWaveUserModule, UWaveAdminModule, FreightModule, 
    RedisModule
  ],
  providers:[
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
  controllers: [HealthController]
})

export class AppModule {}
