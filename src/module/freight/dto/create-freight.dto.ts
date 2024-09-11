import { Freight } from "../entities/freight.entity";
import { PartialType } from '@nestjs/mapped-types';

export class CreateFreightDto extends PartialType(Freight) {}

