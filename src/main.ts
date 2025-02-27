import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleWare/log.middleware';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      disableErrorMessages: true,
      transform: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
