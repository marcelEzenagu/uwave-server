
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';

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
        type: [{ 
        itemID: { type: String},
        name: { type: String, required: true },
       _id: false 
      }]
      ,required:true
    })
    freightItems:[];
}

export type FreightDocument = Freight & Document
export const FreightSchema = SchemaFactory.createForClass(Freight)