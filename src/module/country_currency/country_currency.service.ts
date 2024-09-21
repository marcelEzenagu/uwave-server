import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';
const http = require('https');


interface TransformedData {
  code: string;
  name: string;
  number: string;
  flag: string;
  // currency: string;
  // currencyName: string;
  currency_code: string;
}

interface ApiResponse {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
  currencyCode: string;
}

@Injectable()
export class CountryCurrencyService {
  constructor(private redisClient: RedisService) {}
  // update countryList
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async loadExchangeRateCron() {
    const result = await axios.get(
process.env.EXCHANGE_URL    );

    const key = 'exchange_rates';
    const responseData = JSON.stringify(result.data.conversion_rates);
    this.redisClient.setValue(key, responseData);
    console.log('Cron job running every EVERY_DAY_AT_MIDNIGHT');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
    // @Cron(CronExpression.EVERY_10_SECONDS)    
  async loadCountryCron() {

   
    const options = {
      method: 'GET',
      hostname: 'country-info.p.rapidapi.com',
      url:"https://country-info.p.rapidapi.com/",
      port: null,
      path: '/',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,

        'x-rapidapi-host': 'country-info.p.rapidapi.com',
      },
    };

    const key = 'countries_data';

    const resp = await axios(options)
    let modifiedCountryList:ApiResponse[] = Object.values(resp.data)
    console.log(modifiedCountryList[1],"countries_data",typeof modifiedCountryList);

  //  for(const item of modifiedCountryList ){
    let modified : TransformedData[] = modifiedCountryList.map(country => {

      return{
        name : country.name,
        code :country.code,
        number :country.dialCode,
        flag :country.flag,
        currency_code :country.currencyCode

      }
  }
    )


    const responseData = JSON.stringify(modified);
    this.redisClient.setValue(key, responseData);
  
    // console.log('loadCountryCron running  EVERY_10_SECONDS');
  }

  async getCountries() : Promise<{}>{
    const key = 'countries_data';

   const data = await this.redisClient.getValue(key);

   const countries =JSON.parse(data)
    return countries
  }

 

 


  async getExchangeRate(currencyCode: string): Promise<{}> {
    if (currencyCode == '') {
      currencyCode = 'ngn';
    }

    currencyCode = currencyCode.toUpperCase();
    const key = 'exchange_rates';

    let res = await this.redisClient.getValue(key);
    const rate = JSON.parse(res)[currencyCode];
    return {
      currencyCode,
      rate,
      baseCurrency:"USD"
    };
  }

 
}
