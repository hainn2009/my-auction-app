import { AUCTIONS_QUEUE } from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuctionsAppModule } from './auctions-app.module';
import { DbWorkerModule } from './db-worker/db-worker.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuctionsAppModule);
  const configService = appContext.get(ConfigService);

  // const port = configService.get<number>('AUCTIONS_PORT') || 3003;
  // const optionTCP = {
  //   transport: Transport.TCP,
  //   options: {
  //     host: '0.0.0.0',
  //     port,
  //   },
  // };

  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL')!;
  const RABBITMQ_QUEUE_DURABLE = configService.get<string>('RABBITMQ_QUEUE_DURABLE') === 'false' ? false : true;

  const auctionsService = await NestFactory.createMicroservice<MicroserviceOptions>(AuctionsAppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: AUCTIONS_QUEUE.MAIN,
      queueOptions: { durable: RABBITMQ_QUEUE_DURABLE },
    },
  });

  const dbWorkerService = await NestFactory.createMicroservice<MicroserviceOptions>(DbWorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: AUCTIONS_QUEUE.WRITE_DB,
      queueOptions: { durable: RABBITMQ_QUEUE_DURABLE },
    },
  });

  await Promise.all([auctionsService.listen(), dbWorkerService.listen()]);

  await appContext.close();
  console.log(`Auction and DB Worker microservices are running`);
}
bootstrap();
