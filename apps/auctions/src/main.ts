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
      host: '0.0.0.0',
      port,
    },
  });

  await app.listen();
  await appContext.close();
  console.log(`🚀 Auctions microservice is running on: http://localhost:${port}`);

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
