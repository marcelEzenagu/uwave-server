import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';
const http = require('https');

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
    //  console.log("RESULT_resp:: ",resp.data)
      this.redisClient.setValue(key, JSON.stringify(resp.data));

    // const req = http.request(options, function (res) {
    //   const chunks = [];

    //   res.on('data', function (chunk) {
    //     chunks.push(chunk);
    //   });

    //   res.on('end', function () {
    //     const body = Buffer.concat(chunks).toLocaleString;
    //     // console.log(body.toString(),"data");

    //     this.redisClient.setValue(key, JSON.stringify(body));
    //     // this.redisClient.setValue(key, body.toString('utf-8'));

    //   });
    // });

    // req.end();
    //  const result =  await axios.get("https://v6.exchangerate-api.com/v6/0826ca61322074d36f7f943d/latest/USD")

    //  console.log("RESULT:: ",result.data.conversion_rates)
    //  const responseData = JSON.stringify(result.data.conversion_rates)
    //   // const key = "country_list"
    //   this.redisClient.setValue(key,responseData)
    console.log('loadCountryCron running  EVERY_10_SECONDS');
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
