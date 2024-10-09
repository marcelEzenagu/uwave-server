import { Module, NestModule } from '@nestjs/common';
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
import { HealthController } from './health/health.controller';
import { SavedItemsModule } from './module/saved-items/saved-items.module';
import { UWaveUserModule } from './module/u-wave-user/u-wave-user.module';
import { UWaveAdminModule } from './module/u-wave-admin/u-wave-admin.module';
import { FreightModule } from './module/freight/freight.module';
import { RedisModule } from './module/redis/redis.module';
import { MailerModule } from './module/mailer/mailer.module';
import { NotificationModule } from './module/notification/notification.module';
import { ItemsModule } from './module/items/items.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CountryCurrencyModule } from './module/country_currency/country_currency.module';
import { ProductCategoryModule } from './module/product-category/product-category.module';
import { ProductSubCategoryModule } from './module/product-sub-category/product-sub-category.module';

import { join } from 'path';

import { ServeStaticModule } from '@nestjs/serve-static';
import { StatusController } from './app.controller';
import { AgentModule } from './module/agent/agent.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public',
     ),
      serveRoot:"/public"
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.URI),
    MongooseModule.forFeature(forFeatureDb),

    UserModule,
    MailerModule,
    NotificationModule,
    VendorModule,
    ProductModule,
    OrderModule,
    AuthModule,
    AdminModule,
    CartModule,
    LogisticsModule,
    SavedItemsModule,
    UWaveUserModule,
    UWaveAdminModule,
    FreightModule,
    RedisModule,
    ItemsModule,
    CountryCurrencyModule,
    ProductCategoryModule,
    ProductSubCategoryModule,
    AgentModule,
  ],
  providers: [],
  controllers: [StatusController,HealthController,],
})
export class AppModule  {}