import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { VendorService } from '../vendor/vendor.service';
import { UserModule } from '../user/user.module';
import { VendorModule } from '../vendor/vendor.module';
import forFeatureDb from 'src/db/for-feature.db';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService,UserService,VendorService],
  imports: [
    MongooseModule.forFeature(forFeatureDb),
  ],})
export class AuthModule {}
