
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';
import { v4 as uuid } from "uuid";

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

    @Prop({
        type:String,
        unique:true,
    })
    
    cartID ?: string;
    
    @Prop({
        type: [{ 
          productID: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          _id: false 
        }],
        default: [],
      })
    products: [];
  
  
      @Prop({ type: Types.ObjectId, ref: 'User', required: true })
      userID: Types.ObjectId;
  
    @Prop({ type: Number, })
    totalCost: number;
    
    @Prop({ type: Date, default: null })
    deletedAt: Date | null;

}

export type OrderDocument = Order & Document

export const OrderSchema = SchemaFactory.createForClass(Order)

// Create a virtual field `orderID` that points to the `_id` field
OrderSchema.virtual('orderID').get(function (this: OrderDocument) {
    return (this._id as Types.ObjectId).toHexString(); // Explicitly cast _id to ObjectId and convert to string
  });