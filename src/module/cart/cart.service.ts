import { Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './entities/cart.entity';
import { InjectModel } from  '@nestjs/mongoose';
import { Model } from  'mongoose';


@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  addToCart(createCartDto: Cart) {
    console.log("HERE addToCart")
    const newUserCart = new this.cartModel(createCartDto)
    return newUserCart.save();
  }

  findAll() {
    return `This action returns all cart`;
  }

  async findOne(userID: string) {
    const where = {userID}
    return await  this.cartModel.findOne().where(where).exec();
  }

 async update(userID: string, updateCartDto: UpdateCartDto) {
    const where = {userID}
    return await  this.cartModel.findOneAndUpdate(where,updateCartDto,{new:true}    )

  }

 async remove(userID: string) {
  const where = {userID}

    return await  this.cartModel.findOneAndDelete(where)

    // return `This action removes a #${id} cart`;
  }

  async findWhere(where:{}):Promise<Cart> {
    return await  this.cartModel.findOne().where(where).exec();
  }

}
