import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BOOKS_CLIENT } from './constant';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BOOKS_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: "localhost",
            port: config.get<number>('BOOKS_CLIENT_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule { }
