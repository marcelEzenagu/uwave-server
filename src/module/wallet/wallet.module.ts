import { MiddlewareConsumer,forwardRef, Module, RequestMethod } from '@nestjs/common';

import { MongooseModule } from "@nestjs/mongoose";
import forFeatureDb from 'src/db/for-feature.db';
import { AccessTokenMiddleware } from '../common/middleware/auth.middleware'
import { StripePayment } from 'src/helpers/stripePayment';

import { ErrorFormat } from 'src/helpers/errorFormat';

import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
  imports: [MongooseModule.forFeature(forFeatureDb),]
})
export class WalletModule {}
