import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { Document, Types } from 'mongoose';

import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";


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


    @Prop({ required:true})
    itemName:string;
    
    @Prop({ required:true, type: [String],

        validate: {
            validator: (images: string[]) => images.length > 0, // Ensure the array has at least one item
            message: 'images array must contain at least one image',
        }
        
    })
    images:string[];

    @Prop({ required:true})
    itemCategory:string;

    @Prop({ required:true})
    itemSubCategory:string;

    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productID: Types.ObjectId;

    @Prop({ required:true})
    vendorID:string;
    
    @Prop({ required:true})
    quantity:Number;

    @Prop({ required:true})
    rate:Number;

    @Prop({ type: String, default: '', maxlength: 1000 })
    description:string;



  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
  
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

ItemSchema.index({ vendorID: 1, productID: 1,itemName:1 }, { unique: true });