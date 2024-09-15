import { Module } from '@nestjs/common';
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


@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService,UserService,VendorService,UWaveUserService,
  RedisService,MailerService

  ],
  imports: [
    MongooseModule.forFeature(forFeatureDb),
  ],})
export class AuthModule {}
