import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UWaveAdminService } from './u-wave-admin.service';
import { CreateUWaveAdminDto } from './dto/create-u-wave-admin.dto';
import { UpdateUWaveAdminDto } from './dto/update-u-wave-admin.dto';

@Controller('u-wave-admin')
export class UWaveAdminController {
  constructor(private readonly uWaveAdminService: UWaveAdminService) {}

  @Post()
  create(@Body() createUWaveAdminDto: CreateUWaveAdminDto) {
    return this.uWaveAdminService.create(createUWaveAdminDto);
  }

  @Get()
  findAll() {
    return this.uWaveAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uWaveAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUWaveAdminDto: UpdateUWaveAdminDto) {
    return this.uWaveAdminService.update(+id, updateUWaveAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uWaveAdminService.remove(+id);
  }
}
