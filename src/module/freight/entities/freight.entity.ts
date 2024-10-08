
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';
import { PaymentStatusType } from "src/module/order/entities/order.entity";

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        // delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  })


export class Freight {

    @Prop({ type: Types.ObjectId, ref: 'WaveUser', required: true })
    userID: Types.ObjectId;

    @Prop({type:String,required:true})
    freightType:string

    @Prop({type:Boolean,required:true})
    agreeToTerms:boolean

    @Prop({type:Number,required:true})
    freightWeight:number

    @Prop({
      //   type: [{ 
      //   itemID: { type: String},
      //   name: { type: String, required: true },
      //  _id: false 
      // }]
      // ,
      required:true
    })
    freightItems:[];


    @Prop({ type: String,enum:PaymentStatusType,default:PaymentStatusType.REQUIRES_PAYMENT_METHOD })
    paymentStatus: string;

    @Prop({ type: String, })
    paymentIntentID: string;

    @Prop({ type: String, })
    clientSecret: string;


    @Prop({ type: Number, })
    totalCost: number;
    
    @Prop({ type: Date, default: null })
    deletedAt: Date | null;


}

export type FreightDocument = Freight & Document
export const FreightSchema = SchemaFactory.createForClass(Freight)