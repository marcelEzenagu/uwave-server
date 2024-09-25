import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const stripe = require('stripe')(process.env.STRIPE_KEY)


@Injectable()
export class StripePayment {
  async createSession(amount){

    

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: process.env.CURRENCY_TYPE,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // return {dpmCheckerLink:paymentIntent.
    return {
      dpmCheckerLink:`https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      paymentIntentID:paymentIntent.id,
      clientSecret:paymentIntent.client_secret}
  }

  async uploadImage(img_string: string, dir: string, filename: string): Promise<boolean> {
    
    const base64Image = img_string.split(';base64,').pop();
  
    if (!base64Image) {
      throw new HttpException('Invalid image string', HttpStatus.BAD_REQUEST);
    }
  
    // Calculate the size of the base64 image string
    const imageSizeInBytes = (base64Image.length * 3) / 4 - (base64Image.endsWith('==') ? 2 : base64Image.endsWith('=') ? 1 : 0);
  
    const MAX_SIZE_IN_BYTES = Number(process.env.IMAGE_SIZE_LIMIT) // 1MB
  
    // Check if the image exceeds the maximum allowed size
    if (imageSizeInBytes > MAX_SIZE_IN_BYTES) {
      throw new HttpException('Image exceeds 1MB size limit', HttpStatus.PAYLOAD_TOO_LARGE);
    }
    
    // // Extract base64 part of the image
    // const base64Image = img_string.split(';base64,').pop();

    // Make the directory path if it doesn't exist
    const dirPath = path.resolve(dir);

    try {
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the file
      await fs.promises.writeFile(path.join(dirPath, filename), base64Image, { encoding: 'base64' });
      return true;
    } catch (err) {
      throw new HttpException('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
