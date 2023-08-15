import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function start() {
  try {
    const config = new DocumentBuilder()
      .setTitle('Clean_center Project')
      .setDescription('Mini project for clean_center finder')
      .setVersion('1.0.0')
      .addTag('NestJS, Postgres, Swagger')
      .build();
    const PORT = process.env.PORT || 3333;
    const app = await NestFactory.create(AppModule);
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
      console.log(`server ${PORT} da ishga tushdi`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
