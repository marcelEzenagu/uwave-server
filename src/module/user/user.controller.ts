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
import { ChangePasswordDto, ResetPasswordDto } from '../auth/dto/reset.dto';
import { FileService } from 'src/helpers/upload';
import * as bcrypt from 'bcrypt';

import { ErrorFormat } from 'src/helpers/errorFormat';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly errorFormat: ErrorFormat,
    private readonly fileService: FileService
  ) {}

  @Get()
  findAll() {
    try {
      return this.userService.findAll();
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }

  @Get('/details')
  async findOne(@Req() req: Request) {
    try {
      const userID = req['user'].sub;

      return await this.userService.findOne(userID);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
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
      throw new BadRequestException(this.errorFormat.formatErrors(e));
    }
  }
 
  @Patch("change-password")
  async changePassword(@Req() req: Request, @Body() updateUserDto: ChangePasswordDto) {
   const userID = req['user'].sub;

     const passwordHarsh = await this.userService.hashData(updateUserDto.newPassword);
      const where = {userID}
      let user = await this.userService.findWhere(where)
      
       const matches = await bcrypt.compare(updateUserDto.oldPassword, user.password)
       if(!matches){
        throw new BadRequestException("old password don't match")
       }

       user.password=passwordHarsh

        return await this.userService.update(
        userID,
        user,
      );
    
  }

  @Patch("/details")
  async updateDetails(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
      const userID = req['user'].sub;

      updateUserDto.email=undefined
      updateUserDto.password=undefined
      
      const vPath = "public/images/users"
      const imageName =`${userID}.png`
      if(updateUserDto.profilePicture){
        const imagePath = `${vPath}/profilePicture`
         await this.fileService.uploadImage(updateUserDto.profilePicture,imagePath,imageName)
         
        updateUserDto.profilePicture = `${imagePath}/${imageName}`
      }
        return await this.userService.update(
        userID,
        updateUserDto,
      );
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(+id);
    } catch (e) {
      throw new BadRequestException(this.errorFormat.formatErrors(e));
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
