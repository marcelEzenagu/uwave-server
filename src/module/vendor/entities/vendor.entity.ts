import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';


export type VendorDocument = Vendor & Document

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })


export class Vendor {

    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    vendorID : string;

    @Prop({ required:true})
    // @IsNotEmpty({ message: 'firstName should not be empty' })

    firstName:string;
    
    @Prop({ required:true})
    // @IsNotEmpty({ message: 'lastName should not be empty' })

    lastName:string;
    
    @Prop({ required:true,unique:true})
    @IsEmail()
    email:string;
    
    @Prop({ required:true,unique:true})
    // @IsUnique("Vendor","storeName",{ message: 'this storeName already exists' })
    storeName:string;
    
    @Prop({ required:true})
    @IsNotEmpty()
    @Length(6, 20)
    @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      { message: 'Password must contain at least one uppercase letter, one number, and one special character.' })
    password:string;


  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor)