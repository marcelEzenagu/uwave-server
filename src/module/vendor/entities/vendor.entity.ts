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

  @Prop()
  country?: string;

  @Prop({ unique: true })
  phoneNumber?: string;
  
  @Prop()
  homeAddress?: string;

  @Prop()
  idDocumentType?: string;
  
  @Prop()
  idDocument?: string;

  @Prop({ unique: true })
  businessName?: string;

  @Prop()
  businessAddress?: string;

  @Prop()
  cacDocument?: string;

  @Prop({ unique: true })
  cacNumber?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  businessProfilePicture?: string;

  @Prop({ unique: false, })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

  @Prop({ unique: true })
  storeName?: string;

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
