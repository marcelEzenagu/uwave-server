import { PartialType } from '@nestjs/swagger';
import { Shipment } from '../entities/shipment.entity';

export class UpdateShipmentDto extends PartialType(Shipment) {}
