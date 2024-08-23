
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";
import {Product,ProductSchema} from "../../product/entities/product.entity"
export type CartDocument = Cart & Document

export class Cart {

    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    cartID : string;


  @Prop({ type: [ProductSchema], required: true })
  products: Product[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const CartSchema = SchemaFactory.createForClass(Cart)
