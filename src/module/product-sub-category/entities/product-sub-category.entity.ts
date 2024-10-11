
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { CategoryStatus } from "src/module/product-category/entities/product-category.entity";
import { v4 as uuid } from "uuid";
export type ProductSubCategoryDocument = ProductSubCategory & Document

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

export class ProductSubCategory {
    @Prop({ required:true,unique:true})
    subCategoryName:string;
    
    @Prop({ type: Types.ObjectId, ref: 'ProductCategory', required: true })
    productCategory : string;
    
    @Prop({ required:true,enum:CategoryStatus,default:CategoryStatus.INACTIVE})
    status:CategoryStatus;

    @Prop({ type: Date, default: null })
    deletedAt: Date | null;
}

export const ProductSubCategorySchema = SchemaFactory.createForClass(ProductSubCategory)

ProductSubCategorySchema.virtual('subCategoryID').get(function (this: ProductSubCategoryDocument) {
  return (this._id as Types.ObjectId).toHexString(); 
});

ProductSubCategorySchema.index({ subCategoryName: 1, status: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
ProductSubCategorySchema.index({ subCategoryName: "text", status: "text" });