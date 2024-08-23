import { Module } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';

@Module({
  controllers: [LogisticsController],
  providers: [LogisticsService],
  imports: [MongooseModule.forFeature(forFeatureDb)],

})
export class LogisticsModule {}
