import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuctionsAppModule } from './auctions-app.module';

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
  const RABBITMQ_QUEUE = configService.get<string>('RABBITMQ_QUEUE')!;
  const RABBITMQ_QUEUE_DURABLE = configService.get<string>('RABBITMQ_QUEUE_DURABLE') === 'false' ? false : true;
  const optionRMQ: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: RABBITMQ_QUEUE,
      queueOptions: { durable: RABBITMQ_QUEUE_DURABLE },
    },
  };
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuctionsAppModule, optionRMQ);

  await app.listen();
  await appContext.close();
  console.log(`🚀 Auctions microservice is running`);

  // // --- 2️⃣ Start dummy HTTP server (for Render health check) ---
  // const httpPort = Number(process.env.PORT) || 8080;
  // const healthApp = express();

  // // endpoint health check
  // healthApp.get('/', (_, res) => res.send('OK'));
  // healthApp.get('/health', (_, res) => res.json({ status: 'ok' }));

  // healthApp.listen(httpPort, '0.0.0.0', () => {
  //   console.log(`🌍 Health check server listening on port ${httpPort}`);
  // });
}
bootstrap();
