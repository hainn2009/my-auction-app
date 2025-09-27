import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { TrimStringsPipe } from './common/trim-strings.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({
      whitelist: true, // remove field does not exist in DTO definition
      forbidNonWhitelisted: true, // throw error if field does not exist
      transform: true,
    }),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
