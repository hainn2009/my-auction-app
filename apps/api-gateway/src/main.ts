import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ApiGatewayModule } from './api-gateway.module';
import { SocketIoAdapter } from './common/socket-io.adapter';
import { TrimStringsPipe } from './common/trim-strings.pipe';
const cookieParser = require('cookie-parser');

// REDIS_URL (Upstash) takes priority; falls back to REDIS_HOST + REDIS_PORT (local container)
function resolveRedisOptions(configService: ConfigService) {
  const url = configService.get<string>('REDIS_URL');
  if (url) {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port || '6379'),
      ...(parsed.password && { password: decodeURIComponent(parsed.password) }),
      ...(parsed.protocol === 'rediss:' && { tls: {} }),
    };
  }
  return {
    host: configService.get<string>('REDIS_HOST'),
    port: configService.get<number>('REDIS_PORT'),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('GATEWAY_PORT', 3000);
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  app.enableCors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Config websocket
  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: resolveRedisOptions(configService),
  });

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`API Gateway is running on: http://localhost:${port}`);
}
bootstrap();
