import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuctionsModule } from './auctions/auctions.module';

@Module({
  imports: [
    UsersModule, BooksModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        USERS_CLIENT_PORT: joi.number().default(3001),
        BOOKS_CLIENT_PORT: joi.number().default(3002),
        MONGODB_URI: joi.string().required(),
      }),
    }),
    AuctionsModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule { }
