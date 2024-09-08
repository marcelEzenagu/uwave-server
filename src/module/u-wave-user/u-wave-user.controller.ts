import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UWaveUserService } from './u-wave-user.service';
import { CreateWaveUserDto } from './dto/create-u-wave-user.dto';
import { UpdateUWaveUserDto } from './dto/update-u-wave-user.dto';

@Controller('u-wave-user')
export class UWaveUserController {
  constructor(private readonly uWaveUserService: UWaveUserService) {}

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
    return this.uWaveUserService.update(+id, updateUWaveUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uWaveUserService.remove(+id);
  }
}
