import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';

export type AgentDocument = Agent & Document & {
    agentID: string;  
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

export class Agent {
  

  @Prop({type: String})
  country?: string;

  @Prop({ type: String })
  phoneNumber?: string;
  
  @Prop({type: String})
  homeAddress?: string;

  @Prop({type: String})
  idDocumentType?: string;
  
  @Prop({type: String})
  idDocument?: string;

  @Prop({type: String})
  permitDocument?: string;

  @Prop({type: String})
  tax_number?: string;

  @Prop({type: String})
  foodLicenseDocument?: string;

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
  profilePicture?: string;
  
  @Prop({type: String})
  businessPicture?: string;
  
  @Prop({type: String})
  businessBank?: string;
  
  @Prop({type: String})
  businessBankAccount?: string;

  @Prop({ type: String })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @Prop({ unique: true, required: true })
  @IsEmail()
  email: string;

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

export const AgentSchema = SchemaFactory.createForClass(Agent);
AgentSchema.index({ firstName: 1, lastName: 1,email:1 }, { unique: true });

AgentSchema.virtual('agentID').get(function (this: AgentDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
    // Explicitly cast _id to ObjectId and convert to string
  });