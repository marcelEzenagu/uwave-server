import { PartialType } from '@nestjs/mapped-types';
import { CreateWaveUserDto } from './create-u-wave-user.dto';

export class UpdateUWaveUserDto extends PartialType(CreateWaveUserDto) {}
