import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryCurrencyDto } from './create-country_currency.dto';

export class UpdateCountryCurrencyDto extends PartialType(CreateCountryCurrencyDto) {}
