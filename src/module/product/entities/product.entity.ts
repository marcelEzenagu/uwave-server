import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";

export enum ProductStatus {
  ACTIVE= "ACTIVE",
  INACTIVE= "INACTIVE",
}
export type ProductDocument = Product & Document

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
export class Product {
    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    productID : string;

    @ApiProperty({
      example: 'beans',
      required: true
   })
    @Prop({ required:true,unique:true})
    productName:string;
    

    @ApiProperty({
      example: 'proteins',
      required: true
   })
    @Prop({ required:true})
    productCategory:string;

    @ApiProperty({
      example: 'plant proteins',
      required: true
   })
    @Prop({ type:String,required:true})
    productSubCategory:string;

    @ApiProperty({
      example:ProductStatus.ACTIVE,
      required: true,
      enum:ProductStatus
   })
    @Prop({ type:String,enum:ProductStatus,default:ProductStatus.INACTIVE})
    productStatus:string;


  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
  
  @ApiProperty({
    example: ["Nigeria","ghana","oman"],
    required: true
 })
  @Prop({ type: [String], default: [] })
  productSupportedCountries:string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.index({ productName: 1, vendorID: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
