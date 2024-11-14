

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Document, Types } from 'mongoose';
import { Item } from "src/module/items/entities/item.entity";
import { Address } from "src/module/user/entities/user.entity";
import { OptionType } from "src/module/order/entities/order.entity";



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

export class Shipment {
  @ApiProperty({
    example: "an orderID",
    required: true,
 })
    
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    orderID:  Types.ObjectId;


    @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
    vendorID:    Types.ObjectId;

    
    @Prop({ type: Types.ObjectId, ref: 'Agent' })
    agentID?:   Types.ObjectId;


    @Prop({
      type: [{ 
        itemID: { type: String, required: true },
        itemName: { type: String, required: true },
        vendorID: { type: String, required: true },
        productID: { type: String, required: true },
        quantity: { type: Number, required: true },
        salesPrice: { type: Number },
        newPrice: { type: Number },
        
        _id: false 
      }],
      default: [],
      })
    items: any[];
    
    @Prop({ type: Number, })
    itemsCost: number;

    @Prop({ type: Number, })
    exhangeRate?: number;

    @Prop({ type: String,enum:OptionType,default:OptionType.PROCESSING})
    status?: string ;

    @Prop()
    destination : string
    @Prop({ type: Date, default: null })
    deletedAt?: Date | null;

}




export type ShipmentDocument = Shipment & Document
export const ShipmentSchema = SchemaFactory.createForClass(Shipment)

// Create a virtual field `orderID` that points to the `_id` field
ShipmentSchema.virtual('shippingID').get(function (this: ShipmentDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
    // Explicitly cast _id to ObjectId and convert to string
  });

  ShipmentSchema.index({
    vendorID: 1,  // Ensure the text index covers the product's name
    orderID: 1,             // Make the orderID searchable
  }, { unique: true, partialFilterExpression: { deletedAt: null } });

  ShipmentSchema.index({
    'vendorID': 'text',  // Ensure the text index covers the product's name
    'orderID': 'text',             // Make the orderID searchable
  });