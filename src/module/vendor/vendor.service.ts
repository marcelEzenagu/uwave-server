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

// all by dateRange
  // dashboardStat 
    // sales vs totalOrders 
    // getVendorOrders
    // getNewCustomersOf-vendor
    // getTotalSections for a vendor
    // getTotalVendorProduct;


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
      const user = await this.findWhere({ "_id":vendorID});

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


  async adminFindAll(page,limit: number,search:string, isDisabled:boolean) {
    // search = search.trim()
    const skip = (page - 1) * limit;
    const filter: any = {}

    if (search  && search.trim()) {
      const regex = new RegExp(search, 'i'); // 'i' for case-insensitive matching
      filter.$or = [
        { lastName: { $regex: regex } },    // Match `product.name` with regex
        { firstName: { $regex: regex } },    // Match `product.name` with regex
        { email: { $regex: regex } },                 // Match `orderID` with regex
      ];
    }

    if(isDisabled === true){
      filter.isDisabled = true
    }

    console.log("FILTER",filter)
    const data =  await  this.vendorModel.find(filter)
                                          .skip(skip)
                                          .limit(limit)
                                          .exec();

const total = await this.vendorModel.countDocuments();

    return{
    data,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit)
    }
    
  }
  
  async findOne(id):Promise<Vendor> {
    const where = {"_id":id}
    console.log("where: ",where)
    return await  this.vendorModel.findOne(where).exec();
  
  }
  
  async update(id: string, updateVendorDto: UpdateVendorDto):Promise<Vendor> {
    try{

      const where= {"_id":id}
      return await  this.vendorModel.findOneAndUpdate(where,updateVendorDto, {new: true })
    }catch(e){
      console.log("ERROR==",e)

    }
  }

  async findWhere(where:{}):Promise<VendorDocument> {
    return await  this.vendorModel.findOne(where).exec();
  }
  
  async delete(where):Promise<any> {
    const params = {"_id":where.vendorID}
    where.deletedAt = new Date()
  return await  this.vendorModel.findOneAndUpdate(params,where,{new:true}).exec;
  }

  async remove(where):Promise<any> {
    console.log("DELETEING", where)
    return  await  this.vendorModel.findOneAndDelete(where)
    .then(deletedDoc => {
      if (deletedDoc) {
        return "Deleted document:"
      } else {
        console.log("No document found for delete.");
      }
    })
    .catch(err => {
      console.error("Error finding and deleting document:", err);
      throw new Error(`Error finding and deleting document:, ${err}`);
    });

  }

  async verifyEmail(where):Promise<VendorDocument> {
   
    const update = {
      isEmailVerified:true
    }
    return await  this.vendorModel.findOneAndUpdate(where,update, {new: true });
  }


}
