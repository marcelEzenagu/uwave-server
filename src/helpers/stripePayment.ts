import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaymentStatusType } from 'src/module/order/entities/order.entity';
const stripe = require('stripe')(process.env.STRIPE_KEY);

@Injectable()
export class StripePayment {
  async createSession(amount) {
    console.log('samount:::', amount);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: process.env.CURRENCY_TYPE,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        paymentIntentID: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (e) {
      console.log('error:::', e);
    }
  }

  async confirmPaymentIntent(paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status != PaymentStatusType.SUCCESS) {
      throw new BadRequestException('order not-yet paid for.');
    }
    return paymentIntent;
  }

  async createPaymentSession(
    amount: number,
    currency: string,
    frequency: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    // Determine if the session is recurring based on the frequency
    const isRecurring = frequency !== 'one-off';
    let interval;

    // Map the frequency to a Stripe-recognized interval
    switch (frequency) {
      case 'weekly':
        interval = 'week';
        break;
      case 'fortnightly':
        // Stripe doesn't natively support fortnightly; use biweekly logic or handle it differently
        interval = 'week';
        break;
      case 'monthly':
        interval = 'month';
        break;
      default:
        interval = null; // One-off
    }

    const price = await stripe.prices.create({
      unit_amount: amount * 100,
      currency,
      recurring: interval ? { interval } : undefined, // Required for subscriptions
      product_data: {
        name: `${frequency} Donation`,
      },
    });
    const paymentOptions = {
      mode: isRecurring ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          // price_data: {
          //   currency,
          //   product_data: {
          //     name:
          //       frequency === 'one-off'
          //         ? 'One-Off Donation'
          //         : `${frequency} Donation`,
          //   },
          //   unit_amount: amount * 100,
          //   ...(isRecurring && interval ? { recurring: { interval } } : {}),
          // },
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        frequency,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    const session = await stripe.checkout.sessions.create(paymentOptions);
    return session;
  }
}
