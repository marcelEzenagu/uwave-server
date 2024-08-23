import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Vendor, VendorDocument } from '../vendor/entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(@InjectModel(Vendor.name) private readonly vendorModel: Model<VendorDocument>) {}


  create(createVendorDto: Vendor) {
    const newVendor = new this.vendorModel(createVendorDto)
    return newVendor.save();
    
  }

  async findAll():Promise<Vendor[]> {
    return await  this.vendorModel.find().exec();
    
  }
  
  async findOne(id):Promise<Vendor> {
    return await  this.vendorModel.findById(id).exec();
  }
  
  async update(id: number, updateVendorDto: Vendor):Promise<Vendor> {
    return await  this.vendorModel.findByIdAndUpdate(id, updateVendorDto, {new: true})
  }
  async findWhere(where:{}):Promise<Vendor> {
    return await  this.vendorModel.findOne().where(where).exec();
  }
  
  async remove(where):Promise<any> {
  // async remove(id):Promise<any> {
    // return await  this.vendorModel.findByIdAndDelete(id);
    return await  this.vendorModel.where(where).findOneAndDelete().exec;
  }

  formatErrors(error: any) {
   
    // console.log("ERROR._name:: ", error)
    // console.log("ERROR.name:: ", Object.values(error.keyValue)[0])
    // console.log("ERROR__name:: ", Object.keys(error.keyPattern))
    
    // return
    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
     const value =Object.values(error.keyValue)[0];
      //  return `Duplicate value for field: ${field}`;
       return `this ${field},${value} already exists in our record` ;
 
     }else{
       const formattedErrors = [];
       for (const key in error.errors) {
         if (error.errors.hasOwnProperty(key)) {
           formattedErrors.push({
             field: key,
             message: error.errors[key].message,
           });
         }
       }
       return formattedErrors;
 
     }
 
   }
}
