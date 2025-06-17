import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('gateway.port');
  const origin = configService.get<string>('gateway.allowedOrigins');
  app.enableCors({ origin });

  await app.listen(port!);
}
bootstrap();
