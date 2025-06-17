import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/app.configuration';
import { WebhookModule } from '../core/webhook/webhook.module';
import { AppController } from './app.controller';
import { NatsModule } from '../core/nats/nats.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true }), WebhookModule, NatsModule],
  controllers: [AppController],
})
export class AppModule {}
