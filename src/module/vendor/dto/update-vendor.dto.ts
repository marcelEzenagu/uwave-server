import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { Vendor } from '../entities/vendor.entity';

export class UpdateVendorDto extends PartialType(Vendor) {}
