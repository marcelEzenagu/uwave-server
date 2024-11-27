import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export type VendorDocument = Vendor & Document & {
  vendorID: string;  
}

export enum VendorStat {
  VERIFIED= "VERIFIED",
  PENDING= "PENDING",
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

export class Vendor {
  

  @ApiProperty({
    example: 'ghana',
    required: true
 })
  @Prop({type: String})
  country?: string;

  @ApiProperty({
    example: '2348183940563',
    required: true
 })
  @Prop({ type: String })
  phoneNumber?: string;
  
  @ApiProperty({
    example: '2348183940563',
    required: true
 })
  @Prop({ type: String })
  businessPhoneNumber?: string;
  
  @ApiProperty({
    example: 'km 10 benin-asaba, expressway',
 })
  @Prop({type: String})
  homeAddress?: string;

 
  @Prop({type: String})
  idDocumentType?: string;
  @Prop({type: String})
  idDocumentNumber?: string;
  @Prop({type: String})
  idDocumentFront?: string;
  @Prop({type: String})
  idDocumentBack?: string;

  @Prop({type: String})
  interviewDate?: string;
  @Prop({type: String})
  interviewLink?: string;
  

  @Prop({type: String})
  permitDocument?: string;

  @Prop({type: String})
  tax_number?: string;

  @Prop({type: String})
  nafdacRegistration?: string;

  @ApiProperty({
    example: 'expressway Home',
    required: true
 })
  @Prop({ type: String })
  businessName?: string;

  @ApiProperty({
    example: 'km 10 benin-asaba, expressway',
    required: true
 })
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
  profilePicture?: string;
  
  @Prop({type: String})
  businessPicture?: string;
  @Prop({type: String})
  processVideo?: string;
  
  @Prop({type: String})
  businessBank?: string;


  @Prop({type: String})
  businessBankAccount?: string;
  @Prop({type: String})
  businessBankAccountName?: string;

  @Prop({type: String,enum:VendorStat, default:VendorStat.PENDING})
  status?: string;
  

  @Prop({ type: String })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

  @Prop({ type: String })
  storeName?: string;

  @Prop({ type: Boolean })
  isDisabled: Boolean;

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


  @Prop({ type: Boolean })
  isVerified: Boolean ;
  @Prop({ type: Boolean })
  isEmailVerified: Boolean ;
  @Prop({ type: Boolean })
  hasAcknowleged: Boolean ;
}


export const VendorSchema = SchemaFactory.createForClass(Vendor);
VendorSchema.index({ firstName: 1, lastName: 1,email:1 }, { unique: true });
VendorSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

VendorSchema.virtual('vendorID').get(function (this: VendorDocument) {
  return (this._id as Types.ObjectId).toHexString(); 
});