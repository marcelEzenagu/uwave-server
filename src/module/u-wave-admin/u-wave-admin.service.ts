import { Injectable } from '@nestjs/common';
import { CreateUWaveAdminDto } from './dto/create-u-wave-admin.dto';
import { UpdateUWaveAdminDto } from './dto/update-u-wave-admin.dto';

@Injectable()
export class UWaveAdminService {
  create(createUWaveAdminDto: CreateUWaveAdminDto) {
    return 'This action adds a new uWaveAdmin';
  }

  findAll() {
    return `This action returns all uWaveAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uWaveAdmin`;
  }

  update(id: number, updateUWaveAdminDto: UpdateUWaveAdminDto) {
    return `This action updates a #${id} uWaveAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} uWaveAdmin`;
  }
}
