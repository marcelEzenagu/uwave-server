
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";
import {Product,ProductSchema} from "../../product/entities/product.entity"
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

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CartSchema = SchemaFactory.createForClass(Cart)
