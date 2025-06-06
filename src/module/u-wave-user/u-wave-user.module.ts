import { Module } from '@nestjs/common';
import { UWaveUserService } from './u-wave-user.service';
import { UWaveUserController } from './u-wave-user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AuthModule } from '../auth/auth.module';
import { FileService } from 'src/helpers/upload';

@Module({
  controllers: [UWaveUserController],
  providers: [UWaveUserService,FileService],
  imports: [MongooseModule.forFeature(forFeatureDb),AuthModule],
})

export class UWaveUserModule {}