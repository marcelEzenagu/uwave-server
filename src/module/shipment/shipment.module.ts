import { Module,forwardRef } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
// import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';
import { UtilityService } from 'src/helpers/utils';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService,UtilityService],
  imports: [MongooseModule.forFeature(forFeatureDb),
    forwardRef(() =>     AppModule),
  ]

})
export class ShipmentModule {}
