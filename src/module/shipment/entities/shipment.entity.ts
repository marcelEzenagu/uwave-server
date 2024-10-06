import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export type ShipmentDocument = Shipment & Document & {
    ShipmentID: string;  
}
export enum ShipmentStatus {
    Accepted= "Accepted",
    Processing= "Processing",
    Shipped= "Shipped",
    Delivered= "Delivered",
    Completed= "Completed"
}
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

  @Prop({type: Number, required: true })
  numberOfItems: Number;
  
  
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true,unique:true })
  orderID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true})
  agentID: Types.ObjectId;

  @Prop({ required: true })
  destination: string;
  @Prop({ required: true,enum:ShipmentStatus,default:ShipmentStatus.Accepted })
  status: string;


  @Prop({ type: Date })
  dateOfLoading: Date | null;

  @Prop({ type: Number, default: null })
  estimatedDeliveryTime: Number | null;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
ShipmentSchema.index({ orderID: 1, agentID: 1 }, { unique: true });

ShipmentSchema.virtual('shipmentID').get(function (this: ShipmentDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
});