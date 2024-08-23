import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: User) {
    console.log("HERE NEO")
    const newUser = new this.userModel(createUserDto)
    return newUser.save();  
  }

  async findAll() {
    return await  this.userModel.find().exec();
  }

  async findOne(id):Promise<User> {
    return await  this.userModel.findById(id).exec();
  }
  
  async findWhere(where:{}):Promise<User> {
    return await  this.userModel.findOne().where(where).exec();
    // return await  this.userModel.findById(id).exec();
  }

  async update(id: number, updateUserDto: User):Promise<User> {
    return await  this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true})
  }

  // async remove(id):Promise<any> {
  //   return await  this.userModel.findByIdAndDelete(id);
  // }


  async remove(where):Promise<any> {
    // async remove(id):Promise<any> {
      // return await  this.userModel.findByIdAndDelete(id);
      return await  this.userModel.findOneAndDelete(where)
    }
    
  formatErrors(error: any) {
    console.log("ERROR:: ",error.name)

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

}