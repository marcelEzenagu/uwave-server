import {
  Controller,
  Get,
  BadRequestException,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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
  findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(+id);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    try {
      return this.userService.update(+id, updateUserDto);
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
