import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


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

export class FreightReceipt {
    @Prop({type:String})
    provider:string

    @Prop({type:String})
    providerTrackingID:string

    @Prop({type:String,required:true})
    dateDropped:string

    @Prop({type:String,required:true})
    eta:string

    @Prop({type:Number,required:true})
    parcelWeight:Number

    @Prop({type:Number,required:true})
    noOfPackages:Number

    @Prop({type:String,required:true})
    origin:string

    @Prop({type:String,required:true})
    customerName:string
}


export type FreightReceiptDocument = FreightReceipt & Document
export const FreightReceiptSchema = SchemaFactory.createForClass(FreightReceipt)

