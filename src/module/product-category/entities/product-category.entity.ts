import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { v4 as uuid } from "uuid";
export type ProductCategoryDocument = ProductCategory & Document

export enum CategoryStatus {
  ACTIVE= "ACTIVE",
  INACTIVE= "INACTIVE",
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

export class ProductCategory {
  @Prop({ required:true,unique:true})
  categoryName:string;
  
  @Prop({ })
  categoryImage:string;

  @Prop({ required:true,enum:CategoryStatus,default:CategoryStatus.INACTIVE})
  status:string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory)

ProductCategorySchema.virtual('categoryID').get(function (this: ProductCategoryDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
    // Explicitly cast _id to ObjectId and convert to string
  });