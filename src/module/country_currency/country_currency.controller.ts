import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CountryCurrencyService } from './country_currency.service';
import { CreateCountryCurrencyDto } from './dto/create-country_currency.dto';
import { UpdateCountryCurrencyDto } from './dto/update-country_currency.dto';

@Controller('country-currency')
export class CountryCurrencyController {
  constructor(private readonly countryCurrencyService: CountryCurrencyService) {}

  @Get()
  findAll() {
    return this.countryCurrencyService.getCountries();
  }

  @Get(':currencyCode')
  findOne(@Param('currencyCode') currencyCode: string) {
    
    return this.countryCurrencyService.getExchangeRate(currencyCode);
  }

}
