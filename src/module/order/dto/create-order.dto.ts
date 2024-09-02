import { Order } from "../entities/order.entity";
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto extends PartialType(Order) {}
