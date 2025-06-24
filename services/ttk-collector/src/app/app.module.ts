import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configs/app.configurations';
import { AppController } from './app.controller';
import { EventHandlerModule } from '../core/event-handler/event-handler.module';
import { NatsListenerModule } from '../core/nats/nats-listener.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    EventHandlerModule,
    NatsListenerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
