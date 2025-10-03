import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_CLIENT } from '../constant';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GeoLocationService } from './utils/geo-location.service';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: USERS_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: config.get<number>('USERS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GeoLocationService],
})
export class AuthModule {}
