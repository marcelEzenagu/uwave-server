import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [MongooseModule.forFeature(forFeatureDb)],

})
export class AdminModule {}
