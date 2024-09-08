import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedItemDto } from './create-saved-item.dto';

export class UpdateSavedItemDto extends PartialType(CreateSavedItemDto) {}
