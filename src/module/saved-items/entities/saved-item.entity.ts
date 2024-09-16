
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { Document, Types } from 'mongoose';

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        // delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
    timestamps: true,
  })
export class SavedItem {
    @Prop({ type: Types.ObjectId, ref: 'Item', required: true })
    itemID: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userID: Types.ObjectId;
}

export type SavedItemDocument = SavedItem & Document
export const SavedItemSchema = SchemaFactory.createForClass(SavedItem)
SavedItemSchema.index({ userID: 1, productID: 1 }, { unique: true });