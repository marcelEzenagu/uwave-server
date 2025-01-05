import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaymentStatusType } from 'src/module/order/entities/order.entity';
const stripe = require('stripe')(process.env.STRIPE_KEY)


@Injectable()
export class StripePayment {
  async createSession(amount){
console.log("samount:::",amount)
    try{
      const paymentIntent = await stripe.paymentIntents.create({
            amount: amount*100,
            currency: process.env.CURRENCY_TYPE,
            automatic_payment_methods: {
              enabled: true,
            },
      });
      
      
          return {
            dpmCheckerLink:`https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
            paymentIntentID:paymentIntent.id,
            clientSecret:paymentIntent.client_secret}

    }catch(e){
      console.log("error:::",e)

    }
    
  }

  async confirmPaymentIntent(paymentIntentId){

    
     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if(paymentIntent.status != PaymentStatusType.SUCCESS ){
       throw new BadRequestException("order not-yet paid for.");
     }
    return paymentIntent

  }
  
  async createPaymentSession(amount: number, currency: string, isRecurring: boolean, successUrl: string, cancelUrl: string) {
    const paymentOptions = {
      mode: isRecurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: isRecurring ? 'Recurring Donation' : 'One-time Donation',
            },
            unit_amount: amount * 100, // Convert amount to cents
            recurring: isRecurring ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    const session = await stripe.checkout.sessions.create(paymentOptions);
    return session;
  }
  
}
