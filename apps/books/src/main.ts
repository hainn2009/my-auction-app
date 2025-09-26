import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { BooksAppModule } from './booksApp.module';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   BooksAppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 3002,
  //     },
  //   },
  // );
  // await app.listen();

  const app = await NestFactory.create(BooksAppModule);
  const configService = app.get(ConfigService);

  // Book service microservice TCP
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: configService.get<number>('BOOKS_CLIENT_PORT'),
    },
  });

  await app.startAllMicroservices();
  console.log(`📚 Book service running on port ${configService.get('BOOKS_CLIENT_PORT')}`);
}
bootstrap();
