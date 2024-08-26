import {
  Controller,
  Get,
  BadRequestException,
  Post,
  Body,
  Patch,Req,
  Param,UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    try {
      return this.userService.findAll();
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  @Req() req: Request, 

) {
    try {
      const userID = req['user'].sub

      if(id != userID){
        throw new UnauthorizedException("invalid access")
      }
      return this.userService.findOne(id);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.addPreferredCountry(id, updateUserDto.preferredCountry);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }
}
