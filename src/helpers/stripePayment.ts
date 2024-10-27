import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaymentStatusType } from 'src/module/order/entities/order.entity';
const stripe = require('stripe')(process.env.STRIPE_KEY)


@Injectable()
export class StripePayment {
  async createSession(amount){

    
    
const paymentIntent = await stripe.paymentIntents.create({
      amount: 4*100,
      currency: process.env.CURRENCY_TYPE,
      automatic_payment_methods: {
        enabled: true,
      },
});


    return {
      dpmCheckerLink:`https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      paymentIntentID:paymentIntent.id,
      clientSecret:paymentIntent.client_secret}
  }

  async confirmPaymentIntent(paymentIntentId){

    
     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if(paymentIntent.status != PaymentStatusType.SUCCESS ){
       throw new BadRequestException("order not-yet paid for.");
     }
    return paymentIntent

  }
  
}
