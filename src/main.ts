import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Solo permite ingresar la data que se esta esperando, cualquier otro dato del body lo descarta
      forbidNonWhitelisted: true, //Muestra un mensaje de error en caso de enviar informacion adicional no requerida
      transform: true,
      transformOptions: { 
        enableImplicitConversion: true
      }
    }),
  )


  await app.listen(3000);
}
bootstrap();
