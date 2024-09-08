import { SavedItem } from "../entities/saved-item.entity";
import { PartialType } from '@nestjs/mapped-types';

export class CreateSavedItemDto extends PartialType(SavedItem) {}
