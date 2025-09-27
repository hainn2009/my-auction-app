import { NestFactory } from '@nestjs/core';
import { AuctionAppModule } from './auction-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuctionAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
