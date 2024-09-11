import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export type VendorDocument = Vendor & Document;

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
export class Vendor {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  vendorID: string;

  @Prop({type: String})
  country?: string;

  @Prop({ unique: true,type: String })
  phoneNumber?: string;
  
  @Prop({type: String})
  homeAddress?: string;

  @Prop({type: String})
  idDocumentType?: string;
  
  @Prop({type: String})
  idDocument?: string;

  @Prop({ type: String })
  businessName?: string;

  @Prop({type: String})
  businessAddress?: string;

  @Prop({type: String})
  cacDocument?: string;

  @Prop({type: String })
  cacNumber?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({type: String})
  businessProfilePicture?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

  @Prop({ type: String })
  storeName?: string;

  @Prop({ required: true, })
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character.',
  })
  password: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
