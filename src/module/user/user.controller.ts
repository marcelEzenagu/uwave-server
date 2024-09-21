import {
  Controller,
  Get,
  BadRequestException,
  Post,
  Body,
  Patch,
  Req,
  Param,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { ResetPasswordDto } from '../auth/dto/reset.dto';

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

  @Get('/details')
  async findOne(@Req() req: Request) {
    try {
      const userID = req['user'].sub;

      return await this.userService.findOne(userID);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Patch()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userID = req['user'].sub;

      const where = { userID };
      return await this.userService.addPreferredCountry(
        where,
        updateUserDto.preferredCountry.toLowerCase(),
      );
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }
  @Patch("/details")
  async updateDetails(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    // try {
      const userID = req['user'].sub;

      // const where = { userID };
      return await this.userService.update(
        userID,
        updateUserDto,
      );
    // } catch (e) {
    // }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (e) {
      throw new BadRequestException(this.userService.formatErrors(e));
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    console.log('');
    const userID = req['user'].sub;
    dto.userID = userID;

    return await this.userService.resetUserPassword(dto);
  }
}
