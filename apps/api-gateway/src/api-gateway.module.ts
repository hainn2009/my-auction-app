import { AuthModule as LibAuthModule } from '@app/contracts/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AuctionsModule } from './auctions/auctions.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/clouldinary.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    LibAuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        USERS_PORT: joi.number().default(3001),
        MONGODB_URI: joi.string().required(),
        CLOUDINARY_CLOUD_NAME: joi.string().required(),
        CLOUDINARY_API_KEY: joi.string().required(),
        CLOUDINARY_API_SECRET: joi.string().required(),
        RABBITMQ_URL: joi.string().required(),
        AI_SERVICE_URL: joi.string().default('http://localhost:8000'),
      }),
    }),
    AuctionsModule,
    CloudinaryModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
