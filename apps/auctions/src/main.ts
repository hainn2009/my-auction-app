import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuctionsAppModule } from './auctions-app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuctionsAppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuctionsAppModule, {
    transport: Transport.TCP,
    options: {
      port: configService.get<number>('AUCTIONS_CLIENT_PORT') || 3003,
    },
  });

  await app.listen();
  await appContext.close();
}
bootstrap();
