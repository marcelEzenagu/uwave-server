import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";


export type UserDocument = User & Document


export class Address {
  @Prop({ required:true})
  firstName:string;

  @Prop({ required:true})
  lastName:string;

  @Prop({ required:true})
  phoneNumber:string;

  @Prop({ required:true})
  streetName:string;

  @Prop({ required:true})
  country:string;

  @Prop({ required:true})
  city:string;

  @Prop({ required:true})
  state:string;

  @Prop({})
  companyName?:string;

  @Prop({ required:true})
  zipCode:string;

  @Prop({ required:true})
  isDefault:boolean;
  
  @Prop({ required:true,unique:true})
  @IsEmail()
  email:string;

}

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
})
  
export class User {

  @Prop({
      type:String,
      unique:true,
      default : function genUUID(){
          return uuid();
      },
  })
  userID : string;

  @Prop({ required:true})
  // @IsNotEmpty({ message: 'firstName should not be empty' })
  firstName:string;

  @Prop({ required:true})
  lastName:string;

  @Prop({ type:String})
  preferredCountry?:string;

  @Prop({ required:true,unique:true})
  @IsEmail()
  email:string;

  @Prop({ required:true,unique:true})
  phoneNumber:string;

  @Prop({ required:true})
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
  password:string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;



  @Prop({
  type: [Address],
  default: [],
  })
  shippingDetails: [];

  @Prop({
  type: [Address],
  default: [],
  })
  billingDetails: [];
  
  @Prop({type: String})
  profilePicture?: string;
  @Prop({type: Boolean,default:true})
  isActive: Boolean;
  
  @Prop({
  type: [{
    cardHolderName: { type: String, required: true },
    cardNumber: { type: String, required: true },

    isDefault:{ required:true,type:Boolean}
  }],
  default: [],
  })
  cardDetails: [];
}



export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ firstName: 1, lastName: 1,email:1 }, { unique: true, partialFilterExpression: { deletedAt: null } });

UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });