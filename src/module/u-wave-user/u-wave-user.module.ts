import { Module } from '@nestjs/common';
import { UWaveUserService } from './u-wave-user.service';
import { UWaveUserController } from './u-wave-user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UWaveUserController],
  providers: [UWaveUserService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
})

export class UWaveUserModule {}
