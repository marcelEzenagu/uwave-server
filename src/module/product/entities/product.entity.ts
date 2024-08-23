import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";


export type ProductDocument = Product & Document

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })
export class Product {
    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    productID : string;


    @Prop({ required:true})
    name:string;
    
    @Prop({ required:true})
    image:string;

    @Prop({ required:true})
    category:string;

    @Prop({ required:true})
    vendorID:string;
    
    @Prop({ required:true})
    quantity:Number;

    @Prop({ required:true})
    rate:Number;

    @Prop({ type: String, default: '', maxlength: 1000 })
    description:string;

    @Prop({ required:true})
    brandName:string;


  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
  
  @Prop({ type: [String], default: [] })
    supportedCountries:string[];
    // name
    // image
    // category
    // vendorID
    // quantity
    // rate
    // description
    // brandName
    // measurement
    // supportedCountry 
}
export const ProductSchema = SchemaFactory.createForClass(Product)