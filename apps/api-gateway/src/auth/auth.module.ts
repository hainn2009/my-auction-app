import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_CLIENT } from '../constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ClientsModule.registerAsync([
    {
      name: USERS_CLIENT,
      useFactory: (config: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          port: config.get<number>('USERS_CLIENT_PORT'),
        },
      }),
      inject: [ConfigService],
    },
  ])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
