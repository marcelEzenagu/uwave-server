
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Document, Types } from 'mongoose';
import { Item } from "src/module/items/entities/item.entity";

export enum OptionType {
  ACCEPTED= "ACCEPTED",
  CANCELLED= "CANCELLED",
  PROCESSING= "PROCESSING",
  SHIPPED= "SHIPPED",
  RETURNED="RETURNED",
  DELIVERED="DELIVERED"
}

export enum PaymentStatusType {
  SUCCESS= "succeeded",
  REQUIRES_PAYMENT_METHOD= "requires_payment_method",
  REQUIRES_ACTION= "requires_action",
  CANCELLED= "canceled",
}

class Product {
  @Prop({ type: String, required: true })
  productID: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  vendorID: string;  // Ensure vendorID is required and properly typed
}

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  })



 

export class Order {
  @ApiProperty({
    example: "a cartID",
    required: true,
 })
    @Prop({
        type:String,
    })
    cartID ?: string;
    
    @Prop({
        type:[{default:[]}],
        default: [],
      })
    items: Item[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;
  
    
    @Prop({ type: Number, })
    totalCost: number;

    @Prop({ type: Number, })
    exhangeRate?: number;

    @Prop({ type: String, })
    paymentIntentID: string;

    @Prop({ type: String, })
    clientSecret: string;

    @Prop({ type: String,enum:PaymentStatusType,default:PaymentStatusType.REQUIRES_PAYMENT_METHOD })
    paymentStatus: string;
    
    @Prop({ type: String,enum:OptionType,default:OptionType.PROCESSING})
    status?: string ;

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;
}




export type OrderDocument = Order & Document
export const OrderSchema = SchemaFactory.createForClass(Order)

// Create a virtual field `orderID` that points to the `_id` field
OrderSchema.virtual('orderID').get(function (this: OrderDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
    // Explicitly cast _id to ObjectId and convert to string
  });

  OrderSchema.index({
    'items.product.name': 'text',  // Ensure the text index covers the product's name
    'orderID': 'text',             // Make the orderID searchable
  });