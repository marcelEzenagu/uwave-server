import { PartialType } from '@nestjs/mapped-types';
import { WaveUser } from '../entities/u-wave-user.entity';

export class CreateWaveUserDto extends PartialType(WaveUser) {}

