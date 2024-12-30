import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { StripePayment } from 'src/helpers/stripePayment';
import forFeatureDb from 'src/db/for-feature.db';
import { MongooseModule } from "@nestjs/mongoose";
import { UtilityService } from 'src/helpers/utils';

@Module({
  controllers: [DonationController],
  providers: [DonationService,StripePayment,UtilityService],
  imports: [MongooseModule.forFeature(forFeatureDb)],
  
})
export class DonationModule {}
