import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UWaveUserService } from './u-wave-user.service';
import { CreateWaveUserDto } from './dto/create-u-wave-user.dto';
import { UpdateUWaveUserDto } from './dto/update-u-wave-user.dto';
import { FileService } from 'src/helpers/upload';


import { ApiTags } from '@nestjs/swagger';

@ApiTags('u-wave-user')
@Controller('u-wave-user')
export class UWaveUserController {
  constructor(
    private readonly uWaveUserService: UWaveUserService,
private readonly fileService: FileService) {}

  @Post()
  create(@Body() CreateWaveUserDto: CreateWaveUserDto) {
    return this.uWaveUserService.create(CreateWaveUserDto);
  }

  @Get()
  findAll() {
    return this.uWaveUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uWaveUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUWaveUserDto: UpdateUWaveUserDto) {
   
    return this.uWaveUserService.update(id, updateUWaveUserDto);
  }
  @Patch('details/:id')
  async updateDetails(@Param('id') id: string, @Body() updateUWaveUserDto: UpdateUWaveUserDto) {
    const vPath = "public/images/users"
      const imageName =`${"userID"}.png`
      if(updateUWaveUserDto.profilePicture){
        const imagePath = `${vPath}/profilePicture`
         await this.fileService.uploadImage(updateUWaveUserDto.profilePicture,imagePath,imageName)
         
        updateUWaveUserDto.profilePicture = `${imagePath}/${"imageName"}`
      }
    return this.uWaveUserService.update(id, updateUWaveUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uWaveUserService.remove(+id);
  }
}
