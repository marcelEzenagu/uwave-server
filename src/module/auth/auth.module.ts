import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { VendorService } from '../vendor/vendor.service';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';
import forFeatureDb from 'src/db/for-feature.db';
import { MongooseModule } from '@nestjs/mongoose';
import { UWaveUserService } from '../u-wave-user/u-wave-user.service';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { OrderModule } from '../order/order.module';
import { ItemsModule } from '../items/items.module';
import { AgentModule } from '../agent/agent.module';
import { AgentService } from '../agent/agent.service';
import { ErrorFormat } from 'src/helpers/errorFormat';
import { AdminModule } from '../admin/admin.module';


@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService,UserService,UWaveUserService,AgentService,
  RedisService,MailerService,
    ErrorFormat
  ],

  imports: [
    MongooseModule.forFeature(forFeatureDb),
    forwardRef(() => AgentModule),
    forwardRef(() => VendorModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ItemsModule),
    forwardRef(() => AdminModule),
  ],})
export class AuthModule {}
