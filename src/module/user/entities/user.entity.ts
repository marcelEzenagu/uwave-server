import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";


export type UserDocument = User & Document

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
}

export const UserSchema = SchemaFactory.createForClass(User)