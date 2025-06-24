import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import configuration from '../configs/app.configurations';
import { EventHandlerModule } from '../core/event-handler/event-handler.module';
import { NatsListenerModule } from '../core/nats/nats-listener.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    EventHandlerModule,
    NatsListenerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
