import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuctionsAppModule } from './auctions-app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuctionsAppModule);
  const configService = appContext.get(ConfigService);

  const port = configService.get<number>('AUCTIONS_PORT') || 3003;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuctionsAppModule, {
    transport: Transport.TCP,
    options: {
      port,
    },
  });

  await app.listen();
  await appContext.close();
  console.log(`🚀 Auctions microservice is running on: http://localhost:${port}`);
}
bootstrap();
