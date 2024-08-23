import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from "uuid";
import { Type } from "class-transformer";


export type AdminDocument = Admin & Document

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  })


// export class Admin {
export class Admin {

    @Prop({
        type:String,
        unique:true,
        default : function genUUID(){
            return uuid();
        },
    })
    AdminID : string;

    @Prop({ required:true})
    firstName:string;
    
    @Prop({ required:true})
    lastName:string;
    
    @Prop({ required:true,unique:true})
    email:string;
    
    @Prop({ required:true})
    password:string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin)