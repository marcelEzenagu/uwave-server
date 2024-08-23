import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";

export type LogisticDocument = Logistic & Document

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })
export class Logistic {
    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    shipmentID:string

    @Prop({ type: String,})
    // trackingID from maersk
    trackingID?:string

    @Prop({
        type: Number,        unique:true,
      })
    parcelWeight:number


    @Prop({
        type: String,
        unique:true
    })
    customerName:string

    @Prop({

        type: Date,
        default: () => new Date(),  // Corrected the default date assignment
      })
    dateDropped:Date
    // parcelWeight in KG

    trackingDetails:{}
}

export const LogisticSchema = SchemaFactory.createForClass(Logistic)

LogisticSchema.index({ customerName: 1, parcelWeight: 1 }, { unique: true });

// Ensure indexes are created
LogisticSchema.post('init', () => {
  LogisticSchema.indexes();
});