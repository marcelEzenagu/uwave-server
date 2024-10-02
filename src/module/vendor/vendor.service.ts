import { Injectable,BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { Vendor, VendorDocument } from '../vendor/entities/vendor.entity';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../auth/dto/reset.dto';
import { OrderService } from '../order/order.service';


@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private readonly vendorModel: Model<VendorDocument>,
    private readonly orderService: OrderService,

) {}



  // change import to b e the from auth
   hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  
  async resetVendorPassword(dto: ResetPasswordDto): Promise<{}> {
    try {

      if(dto.password != dto.confirmPassword){
        throw new BadRequestException("password and confirmPassword don't match");
        
      }
      const vendorID = dto.vendorID 
      const user = await this.findWhere({ vendorID});

      if (!user) {
        throw new NotFoundException("no vendor with this email");
      }

      user.password = await this.hashData(dto.password);

      this.update(vendorID,user)

      return {
        message: "Password Reset successful",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(error);
      }
      throw error;
    }
  }

  create(createVendorDto: Vendor) {
    const newVendor = new this.vendorModel(createVendorDto)
    return newVendor.save();
    
  }

  async findAll():Promise<Vendor[]> {
    return await  this.vendorModel.find().exec();
    
  }
  
  async findOne(id):Promise<Vendor> {
    const where = {"vendorID":id}
    console.log("where: ",where)
    return await  this.vendorModel.findOne().where(where).exec();
  
    // return await  this.vendorModel.findById(id).exec();
  }
  
  async update(id: string, updateVendorDto: UpdateVendorDto):Promise<Vendor> {
   
    const where= {"vendorID":id}
    return await  this.vendorModel.findOneAndUpdate(where,updateVendorDto, {new: true })
  }
  async findWhere(where:{}):Promise<Vendor> {
    return await  this.vendorModel.findOne().where(where).exec();
  }
  
  async remove(where):Promise<any> {
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
