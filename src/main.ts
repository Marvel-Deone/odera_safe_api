import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('_dds8');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://odera-safe.vercel.app', 'https://ddsafe.vercel.app', 'https://oderasafe.ddsafe.tech', 'https://ddsafe.tech'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('DD-SAFE API')
    .setDescription('Backend API for DDSafe')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('_dds8/docs', app, document);

  await app.listen(process.env.PORT ?? 4000);

  console.log(await app.getUrl());
  console.log('Swagger: ' + (await app.getUrl()) + '/docs');
}

bootstrap();
