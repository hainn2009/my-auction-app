import { AUCTIONS_QUEUE } from '@app/contracts';
import { AuthModule } from '@app/contracts/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CloudinaryModule } from '../cloudinary/clouldinary.module';
import { AUCTIONS_CLIENT } from '../constant';
import { AuctionSubscriberController } from './auction-subscriber.controller';
import { AuctionsController } from './auctions.controller';
import { AuctionsGateway } from './auctions.gateway';
import { AuctionsService } from './auctions.service';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule.forRootAsync(),
    ClientsModule.registerAsync([
      {
        name: AUCTIONS_CLIENT,
        // useFactory: (config: ConfigService) => ({
        //   transport: Transport.TCP,
        //   options: {
        //     host: config.get<string>('AUCTIONS_HOST'),
        //     port: config.get<number>('AUCTIONS_PORT'),
        //   },
        // }),
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')!],
            queue: AUCTIONS_QUEUE.MAIN,
            queueOptions: { durable: config.get<string>('RABBITMQ_QUEUE_DURABLE') === 'false' ? false : true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuctionsController, AuctionSubscriberController, AuctionsGateway],
  providers: [AuctionsService, AuctionsGateway],
})
export class AuctionsModule {}
