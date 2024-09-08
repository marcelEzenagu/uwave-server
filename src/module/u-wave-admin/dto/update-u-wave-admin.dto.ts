import { PartialType } from '@nestjs/mapped-types';
import { CreateUWaveAdminDto } from './create-u-wave-admin.dto';

export class UpdateUWaveAdminDto extends PartialType(CreateUWaveAdminDto) {}
