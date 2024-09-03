import { Injectable,NotFoundException,UnauthorizedException, } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './entities/cart.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';
import { error } from 'console';


@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async addToCart(createCartDto: Cart) {
    
    const where = {"userID":createCartDto.userID}
    const result= await  this.cartModel.findOne().where(where).exec();
    if (result == undefined){
      console.log("HERE addToCart")
      
      const newUserCart = new this.cartModel(createCartDto)
      return newUserCart.save();
    }else{
      console.log("HERE existing cart")
  return result
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(userID: string) {
    const where = {userID}
    const result= await  this.cartModel.findOne().where(where).exec();
    if (result == undefined){
      throw new NotFoundException('cart not found for this user');
    }else{
  return result
    }
  }

  async update(userID: string, updateCartDto: UpdateCartDto) {
    const where = {userID}
    return await  this.cartModel.findOneAndUpdate(where,updateCartDto,{new:true}    )
  }

 async remove(userID: string) {
  const where = {userID}

  const result = await  this.cartModel.findOneAndDelete(where)
  if (result == undefined){
    throw new NotFoundException('user-cart not found');
  }else{
return "cart deleted successfully"   

  }

  }

  async findWhere(where:{}):Promise<Cart> {
    return await  this.cartModel.findOne().where(where).exec();
  }

  formatErrors(error: any) {

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
