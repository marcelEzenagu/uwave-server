import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Document, Types } from 'mongoose';

import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export enum ItemFilter {
  BEST_SELLER= "best_seller",
  LOW_TO_HIGH="low to high",
  HIGH_TO_LOW="high to low"
}

export enum ItemStatus {
  ACTIVE= "ACTIVE",
  INACTIVE= "INACTIVE",
  DRAFT= "DRAFT",
}

export type ItemDocument = Item & Document

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })

export class Item {
    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    ItemID : string;

   
    @Prop({ default: 0 })
    salesCount?: number;
    
    @ApiProperty({
      example: 'fishPie',
      required: true
   })
    @Prop({ required:true})
    itemName:string;
    
    @ApiProperty({
      example: ['rehmat...',"jbhdswnkajs"],
      required: true
   })
    @Prop({ required:true, type: [String],

        validate: {
            validator: (images: string[]) => images.length > 0, // Ensure the array has at least one item
            message: 'images array must contain at least one image',
        }
        
    })
    images:string[];

    @ApiProperty({
      example: 'Protein',
      required: true
   })
    @Prop({ required:true})
    itemCategory:string;

    @ApiProperty({
      example: 'plant protein',
      required: true
   })
    @Prop({ required:true})
    itemSubCategory:string;

    @ApiProperty({
      example: 'abkiwehi388937828',
      required: true
   })
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productID: Types.ObjectId;

  
    @Prop({ required:true})
    vendorID:string;
    
    @ApiProperty({
      example: 5,
      required: true
   })
    @Prop({ required:true})
    quantity:Number;

    @ApiProperty({
      example: 300,
      required: true
   })
    @Prop({ required:true})
    salesPrice:Number;

    @ApiProperty({
      example: 873,
      required: true
   })
    @Prop({ required:true})
    originalPrice:Number;

    @ApiProperty({
      example: 50,
      required: true
   })
    @Prop({ required:true})
    profit:Number;

    @ApiProperty({
      example: 0.5,
      required: true
   })
    @Prop({ })
    discount?:Number;

    @ApiProperty({
      example: 550,
      required: true
   })
    @Prop({ })
    newPrice?:Number;

    @ApiProperty({
      example: 35,
      required: true
   })
    @Prop({ required:true})
    weight:Number;

    @ApiProperty({
      example: "kg",
      required: true
   })
    @Prop({ required:true,type: String})
    weight_unit?:string;

    @ApiProperty({
      example: ItemStatus.ACTIVE,
      required: true,
      enum:ItemStatus,
      default:ItemStatus.DRAFT
   })
    @Prop({ required:true,enum:ItemStatus,default:ItemStatus.DRAFT})
    status:string;

    @ApiProperty({
      example: "found in fishes and you would enjoy it",
      required: true,
      enum:ItemStatus,
      default:ItemStatus.DRAFT
   })
    @Prop({ type: String, default: '', maxlength: 1000 })
    description:string;



  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
  
  @ApiProperty({
    example: ["nigeria","haiti"],
    required: true,
 })
  @Prop({ type: [String], 
    validate: {
        validator: (itemSupportedCountries: string[]) => itemSupportedCountries.length > 0, // Ensure the array has at least one item
        message: 'itemSupportedCountries array must contain at least one country',
    }
   })
    itemSupportedCountries:string[];
  
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

export const ItemSchema = SchemaFactory.createForClass(Item)

ItemSchema.index({ vendorID: 1, productID: 1,itemName: 1, itemCategory: 1, itemSubCategory: 1, salesPrice: 1 }, { unique: true });


ItemSchema.index({
    vendorID: 1,
    itemName: 1,
    itemCategory: 1,
    itemSubCategory: 1,
    itemSupportedCountries: 1,
  }, { unique: true });
// Full-text index on itemName, itemCategory, and itemSubCategory for full-text search
ItemSchema.index({ itemName: 'text', itemCategory: 'text', itemSubCategory: 'text' });