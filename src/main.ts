/* eslint-disable @typescript-eslint/naming-convention */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/filters/allException.filter';

const {
  APP_PORT,
  NODE_ENV,
  npm_package_name,
  npm_package_version,
} = process.env;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
  });

  const logger = app.get<Logger>(Logger);

  const prefixService = 'template';

  app.setGlobalPrefix(prefixService);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  const options = new DocumentBuilder()
    .setTitle(npm_package_name)
    .setDescription('Api destined for template')
    .addTag('Health', 'Help endpoints')
    .addTag('Items', 'Items endpoints')
    .addTag('Orders', 'Orders endpoints')
    .setVersion(npm_package_version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
  await app.listen(APP_PORT, '0.0.0.0', () =>
    logger.log(
      `${npm_package_name} microservice [${NODE_ENV}] is listening on port: ${APP_PORT} 🚀 `,
      'AppStart',
    ),
  );
}
bootstrap();
