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
app.enableCors()
  await app.listen(process.env.PORT);
}

bootstrap();
