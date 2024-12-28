import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { StripePayment } from 'src/helpers/stripePayment';
import forFeatureDb from 'src/db/for-feature.db';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [DonationController],
  providers: [DonationService,StripePayment],
      imports: [MongooseModule.forFeature(forFeatureDb)],
  
})
export class DonationModule {}
