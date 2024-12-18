import { PartialType } from '@nestjs/swagger';
import { CreateFreightReceiptDto } from './create-freight_receipt.dto';

export class UpdateFreightReceiptDto extends PartialType(CreateFreightReceiptDto) {}
