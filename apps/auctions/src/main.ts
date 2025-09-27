import { NestFactory } from '@nestjs/core';
import { AuctionsAppModule } from './auctions-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AuctionsAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
