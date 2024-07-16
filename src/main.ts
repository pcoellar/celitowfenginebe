import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  /*const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Celito WF Engine Test')
    .setDescription('Celito WF Engine Test API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);*/
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
    },
  );
  await app.listen();
}
bootstrap();
