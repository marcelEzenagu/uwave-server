import { PartialType } from '@nestjs/mapped-types';
import { Cart } from '../entities/cart.entity';

export class UpdateCartDto extends PartialType(Cart) {}
