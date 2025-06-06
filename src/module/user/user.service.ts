import { Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException, } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../auth/dto/reset.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  // change import to b e the from auth
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  
  async resetUserPassword(dto: ResetPasswordDto): Promise<{}> {
    try {

      if(dto.password != dto.confirmPassword){
        throw new BadRequestException("password and confirmPassword don't match");
        
      }

      const userID = dto.userID 
      
      const user = await this.findWhere({ userID});

      if (!user) {
        throw new NotFoundException("no user with this userID");
      }

      user.password = await this.hashData(dto.password);

      this.update(userID,user)

      return {
        message: "Password Reset successful",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Invalid email');
      }
      throw error;
    }
  }
  async findAll() {
    const where ={deletedAt:null}
    return await  this.userModel.find().where(where).exec();
  }

  async adminFindAll() {
    return await  this.userModel.find().exec();
  }

  async findOne(id):Promise<User> {
    const where = {"userID":id,
      "deletedAt":null
    }
    console.log("where: ",where)
    return await  this.userModel.findOne().where(where).exec();
  }

  async adminFindOne(id):Promise<User> {
    const where = {"userID":id,
      "deletedAt":null
    }
    console.log("where: ",where)
    return await  this.userModel.findOne().where(where).exec();
  }
  
  async findWhere(where:any):Promise<User> {
    where.deletedAt = null
    return await  this.userModel.findOne().where(where).exec();
  }

  async adminFindWhere(where:{}):Promise<User> {
    return await  this.userModel.findOne().where(where).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto):Promise<User> {
    updateUserDto.isActive = undefined
  //  return await  this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
   const where = {"userID":id}

   try{
  
   if(updateUserDto.billingDetails){
    await this.validateIsDefault(updateUserDto.billingDetails,"Billing Details")
  }
  
  if(updateUserDto.cardDetails){
      await this.validateIsDefault(updateUserDto.cardDetails,"Card Details")

  }
  if(updateUserDto.shippingDetails){
     await  this.validateIsDefault(updateUserDto.shippingDetails,"Shipping Details")
   }
   return  await  this.userModel.findOneAndUpdate(where,updateUserDto,{new:true}    )
  
  }catch(e){
    console.log("ERROR::: ",e)
    throw new BadRequestException(e.message);
  }
  }

  async adminUpdate(id: string, updateUserDto: UpdateUserDto):Promise<User> {
   const where = {"userID":id}

   try{
  
   if(updateUserDto.billingDetails){
    await this.validateIsDefault(updateUserDto.billingDetails,"Billing Details")
  }
  if(updateUserDto.cardDetails){
      await this.validateIsDefault(updateUserDto.cardDetails,"Card Details")

  }
  if(updateUserDto.shippingDetails){
     await  this.validateIsDefault(updateUserDto.shippingDetails,"Shipping Details")
   }
   return  await  this.userModel.findOneAndUpdate(where,updateUserDto,{new:true}    )
  
  }catch(e){
    console.log("ERROR::: ",e)
    throw new BadRequestException(e.message);
  }
  }

  async addPreferredCountry(where :{}, preferredCountry: string):Promise<{}> {
    
    const recentUpdate = await  this.userModel.findOneAndUpdate(where,{ preferredCountry },{new:true}    )
    return {"country":preferredCountry,"baseCurrency":"USD", "currencyCoEfficient":1.2}
  }

  async startResetPassword(where :{}, preferredCountry: string):Promise<{}> {
    
    const recentUpdate = await  this.userModel.findOneAndUpdate(where,{ preferredCountry },{new:true}    )
    return {"country":preferredCountry,"baseCurrency":"USD", "currencyCoEfficient":1.2}
  }
  // async remove(id):Promise<any> {
  //   return await  this.userModel.findByIdAndDelete(id);
  // }


  async remove(where):Promise<any> {
    // async remove(id):Promise<any> {
      // return await  this.userModel.findByIdAndDelete(id);
      // return await  this.userModel.findOneAndDelete(where)
  }
    
  formatErrors(error: any) {
    console.log("ERROR:: ",error)

    if(error.name === 'MongoServerError'){
     const field = Object.keys(error.keyPattern)[0];
       return `Duplicate value for field: ${field}`;
 
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

  async validateIsDefault(items: any[], itemType: string) {
    const defaultCount = items.filter((item) => item.isDefault).length;
  
    if (defaultCount > 1) {
    throw new Error(`Only one ${itemType} can be marked as default.`);
    }
  }

}