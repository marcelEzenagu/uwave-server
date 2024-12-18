import { Injectable } from '@nestjs/common';
import { CreateWaveUserDto } from './dto/create-u-wave-user.dto';
import { UpdateUWaveUserDto } from './dto/update-u-wave-user.dto';
import { InjectModel } from  '@nestjs/mongoose';
import { WaveUser,WaveUserDocument } from './entities/u-wave-user.entity';
import { Model } from  'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UWaveUserService {
constructor(
  @InjectModel(
    WaveUser.name) private wUserModel: Model<WaveUserDocument>
  ) {}


  // change import to b e the from auth
  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
  async create(createWaveUserDto: CreateWaveUserDto) {
    return await  new this.wUserModel(createWaveUserDto).save();
  }

  findAll() {
    return `This action returns all uWaveUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uWaveUser`;
  }

  update(id: string, updateUWaveUserDto: UpdateUWaveUserDto) {
    return `This action updates a #${id} uWaveUser`;
  }

  async findWhere(where:{}):Promise<WaveUser> {
    return await  this.wUserModel.findOne().where(where).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} uWaveUser`;
  }
  
}
