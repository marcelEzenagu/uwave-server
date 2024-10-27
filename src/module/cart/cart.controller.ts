import { Controller,UseGuards, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Request } from 'express';



import { ApiTags } from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Req() req: Request,
  @Body() createCartDto: Cart) {
    try {
      // check for possible validation b4 an add;

      const userID = req['user'].sub
      createCartDto.userID = userID
      return await this.cartService.addToCart(createCartDto);
    } catch (error) {
      console.log("error:: ",error)
    }
  }

 
  @Get()
  findOne(
    @Req() req: Request) {
      const userID = req['user'].sub
    return this.cartService.findOne(userID);
  }

  @Patch()
  update(
    @Req() req: Request, 
    @Body() updateCartDto: UpdateCartDto) {
      const userID = req['user'].sub

    return this.cartService.update(userID, updateCartDto);
  }

  @Delete()
  remove(
    @Req() req: Request)  {
      // try {
        const userID = req['user'].sub
        
        return this.cartService.remove(userID);
      // } catch (e) {
      //   console.log("CART ERROR",e)
      //   throw new BadRequestException(this.cartServiceerrorFormat.formatErrors(e));

      // }
  }
}