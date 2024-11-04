
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';
import { v4 as uuid } from "uuid";

export type CartDocument = Cart & Document


@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,

})

export class Cart {

    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    cartID : string;

    @Prop({
      type: [{ 
        itemID: { type: String, required: true },
        vendorID: { type: String, required: true },
        productID: { type: String, required: true },
        itemName: { type: String, required: true },
        salesPrice: { type: Number },
        newPrice: { type: Number },
        quantity: { type: Number, required: true },
        _id: false 
      }],
      default: [],
    })
  products: [];


    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CartSchema = SchemaFactory.createForClass(Cart)
