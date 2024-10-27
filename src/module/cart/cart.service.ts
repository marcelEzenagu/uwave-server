import { Injectable,NotFoundException,UnauthorizedException, } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './entities/cart.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';


@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async addToCart(createCartDto: Cart) {
    try{

    const where = {"userID":createCartDto.userID}
    const result= await  this.cartModel.findOne().where(where).exec();
    if (!result){
      const newUserCart = new this.cartModel(createCartDto)
      return await newUserCart.save();
    }else{
  return result
    }
  }catch(e){
    console.log("addToCart_error",e)
  }
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(userID: string) {
    try{
    const where = {userID}
    const result= await  this.cartModel.findOne().where(where).exec();
    if (!result){
      console.log('cart not found for this user');

    }else{
  return result
    }
  }catch(e){
    console.log("findOneCart_error",e)
  }
  }

  async update(userID: string, updateCartDto: UpdateCartDto) {
   try{
    const where = {userID}
    return await  this.cartModel.findOneAndUpdate(where,updateCartDto,{new:true}    )
  }catch(e){
    console.log("update-error",e)
  }
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
 async removeCart(cartID,userID: string) {
  const where = {cartID,userID}

  const result = await  this.cartModel.findOneAndDelete(where)
  if (result == undefined){
    throw new NotFoundException('user-cart not found');
  }else{
return "cart deleted successfully"   

  }

  }

  async findWhere(where:{}):Promise<Cart> {
    try{
    return await  this.cartModel.findOne().where(where).exec();
  }catch(e){
    console.log("findWhere-error",e)
  }
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
