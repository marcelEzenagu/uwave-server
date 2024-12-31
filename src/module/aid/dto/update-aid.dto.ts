import { PartialType } from '@nestjs/swagger';
import { CreateAidDto } from './create-aid.dto';

export class UpdateAidDto extends PartialType(CreateAidDto) {}
