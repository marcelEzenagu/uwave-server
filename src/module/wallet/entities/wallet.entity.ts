

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export enum PaymentStatus {
    PAYMENT_FAILED= "FAILED",
    PAYMENT_PENDING= "PENDING",
    PAYMENT_SUCCESS= "SUCCESS",
  }

export enum UserType {
    USER= "USER",
    VENDOR= "VENDOR",
    AGENT= "AGENT",
  }
export enum PaymentType {
    INFLOW= "INFLOW",
    OUTFLOW= "OUTFLOW",
  }
  
export type WalletDocument = Wallet & Document & {
    WalletID: string;  
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

export class Wallet {
  @Prop({type: Number})
  amount: Number;

  @Prop({ type: String })
  vendorID?: string;
  
  @Prop({type: String})
  agentID?: string;

  @Prop({type: String,enum:PaymentStatus,default:PaymentStatus.PAYMENT_PENDING})
  status: PaymentStatus;

  @Prop({ required: true })
  referenceID: string;
  @Prop({ required: true,type: String,enum:PaymentType,default:PaymentType.INFLOW })
  type: string;

  @Prop({ required: true,type: String,enum:UserType,default:UserType.USER })
  userType: string;

  @Prop({ required: true })
  paymentMethod?: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({ referenceID: 1 }, { unique: true });
WalletSchema.index({ referenceID: "text"});

WalletSchema.virtual('walletID').get(function (this: WalletDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
});