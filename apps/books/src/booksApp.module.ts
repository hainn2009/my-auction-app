import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as joi from 'joi';
import { BooksModule } from './books/books.module';

@Module({
  imports: [BooksModule, MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (config: ConfigService) => ({
      uri: config.getOrThrow<string>('MONGODB_URI'),
    }),
    inject: [ConfigService],
  }),
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object({
        BOOKS_CLIENT_PORT: joi.number().default(3002),
        MONGODB_URI: joi.string().required(),
        // .required(),
      }),
    })
  ],
  controllers: [],
  providers: [],
})
export class BooksAppModule { }
