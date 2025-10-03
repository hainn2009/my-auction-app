import { AuthModule } from '@app/contracts/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUCTIONS_CLIENT } from '../constant';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: AUCTIONS_CLIENT,
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: config.get<number>('AUCTIONS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
