import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { json } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());

  // Body size limit
  app.use(json({ limit: '1mb' }));

  app.enableCors({
    origin: [
      'http://localhost:3000', // local frontend
      'https://residents-atjo.onrender.com', // deployed frontend
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-user-id',
      'idempotency-key',
    ],
    credentials: true, // Add this if you use cookies/auth
  });

  // Enable validation pipes (reject unknown fields)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Residents Noticeboard API')
    .setDescription('API docs for Announcements 2.0')
    .setVersion('2.0')
    .addTag('announcements')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 4000);
  console.log(
    `Backend running on http://localhost:${process.env.PORT || 4000}`,
  );
}
bootstrap();
