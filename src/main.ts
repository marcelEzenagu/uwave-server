import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './helpers/exception';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin:true,
    // origin:  (origin, callback) => {
    //   if (['http://localhost:3000',"*"].indexOf(origin) !== -1) {
    //     callback(null, true);
    //   } 
    //   // else {
    //   //   callback(new Error('Not allowed by CORS'));
    //   // }
    // },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }
  )
  await app.listen(process.env.PORT);
}
bootstrap();