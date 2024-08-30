import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export type VendorDocument = Vendor & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
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

  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  phoneNumber: string;
  @Prop({ required: true })
  homeAddress: string;
  @Prop({ required: true })
  idDocumentType: string;
  @Prop({ required: true })
  idDocument: string;
  @Prop({ required: true })
  businessName: string;
  @Prop({ required: true })
  businessAddress: string;
  @Prop({ required: true })
  businessPhone: string;
  @Prop({ required: true })
  cacDocument: string;
  @Prop({ required: true })
  cacNumber: string;
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  lastName: string;
  @Prop({ type: String })
  businessProfilePicture?: string;
  
  @Prop({ required: true, unique: true })
  @IsEmail()
  businessEmail: string;

  @Prop({ required: true, unique: true })
  // @IsUnique("Vendor","storeName",{ message: 'this storeName already exists' })
  storeName: string;

  @Prop({ required: true })
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
