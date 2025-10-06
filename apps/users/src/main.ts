import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersAppModule } from './users-app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UsersAppModule);
  const configService = appContext.get(ConfigService);

  const port = configService.get<number>('USERS_PORT') || 3001;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersAppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port,
    },
  });

  await app.listen();
  await appContext.close();
  console.log(`🚀 Users microservice is running on: http://localhost:${port}`);

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
