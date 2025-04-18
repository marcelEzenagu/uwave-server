import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { ProductSubCategory } from "src/module/product-sub-category/entities/product-sub-category.entity";
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
  status:CategoryStatus;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  // subCategories: ProductSubCategory[];

}

export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory)

ProductCategorySchema.virtual('categoryID').get(function (this: ProductCategoryDocument) {
    return (this._id as Types.ObjectId).toHexString(); 
    // Explicitly cast _id to ObjectId and convert to string
  });


// //   // New virtual to populate subcategories
ProductCategorySchema.virtual('subCategories', {
  ref: 'ProductSubCategory', // The model to link to
  localField: '_id',         // The field in ProductCategory
  foreignField: 'productCategory', // The field in ProductSubCategory
  justOne: false,            // There will be multiple subcategories
});


ProductCategorySchema.set('toJSON', { virtuals: true });
ProductCategorySchema.set('toObject', { virtuals: true });

ProductCategorySchema.index({ categoryName: 1, status: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } });
ProductCategorySchema.index({ categoryName: "text", status: "text" });