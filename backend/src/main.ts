
import { ClassSerializerInterceptor, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { urlencoded, json, } from 'express';
import * as swaggerStats from 'swagger-stats';
import { useContainer, } from 'class-validator';
import * as bodyParser from 'body-parser';
import * as xmlBodyParser from 'express-xml-bodyparser';
import { join } from 'path';

import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import { UUIDExceptionFilter } from './errors/exception-filters/uuid-exception.filter';
import { GlobalExceptionFilter } from './errors/exception-filters/global-exception.filter';

require('dotenv').config();

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  try {

    app.enableCors({
      exposedHeaders: ["Content-Disposition", "File-name"]
    });

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useStaticAssets(join(__dirname, '..', 'temp'), {
      prefix: '/temp/',
    });

    await setupSwagger(app);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    app.useGlobalFilters(new UUIDExceptionFilter(), new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ transform: true, }));

    app.use(json({ limit: '10mb' }));
    app.use(bodyParser.raw({ type: 'application/xml' }));
    app.use(xmlBodyParser());

    await app.listen(process.env.PORT);
    const url = await app.getUrl();

    Logger.warn(`[${process.env.SYSTEM_NICKNAME}] - ${process.env.SYSTEM_NAME}`);
    Logger.warn(`Versão: ${process.env.SYSTEM_VERSION}`);
    Logger.warn(`Current env: ${process.env.MODE}`);
    Logger.warn(`Current port: ${process.env.PORT}`);
    Logger.warn(`API URL: ${url}`);


    if (module.hot) {
      Logger.warn(`Hot reload is enabled`);
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  } catch (e) {
    Logger.error(`Falha ao subir a aplicação.`);
    Logger.error(`Erro: ${e.message}`);
    Logger.error(e.stack);
  }
}

async function setupSwagger(app: NestExpressApplication) {
  const authService = await app.resolve(AuthService);

  const config = new DocumentBuilder()
    .setTitle(`${process.env.SYSTEM_NICKNAME} - ${process.env.SYSTEM_NAME}`)
    .setDescription(`API da aplicação: ${process.env.SYSTEM_NICKNAME} - ${process.env.SYSTEM_NAME}`)
    .setVersion(process.env.SYSTEM_VERSION)
    .setExternalDoc('Swagger File', 'api-json')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(swaggerStats.getMiddleware({
    swaggerSpec: document,
    uriPath: '/api/status',
    name: `${process.env.SYSTEM_NICKNAME} - Status`,
    authentication: true,
    onAuthenticate: async (req, username, password) => {
      return await authService.validateSwaggerStatusUser(username, password);
    }
  }));

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
    },
  };

  SwaggerModule.setup('api', app, document, swaggerOptions);
  SwaggerModule.setup('docs', app, document, swaggerOptions);
}

bootstrap();
