import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersAppModule } from './users-app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UsersAppModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersAppModule, {
    transport: Transport.TCP,
    options: {
      port: configService.get<number>('USERS_CLIENT_PORT') || 3001,
    },
  });

  await app.listen();
  await appContext.close();
}
bootstrap();
