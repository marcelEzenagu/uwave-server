import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './helpers/exception';
import * as bodyParser from 'body-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({}));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({
    origin:true,
 
    
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }
  )

  await app.listen(process.env.PORT);
}
bootstrap();