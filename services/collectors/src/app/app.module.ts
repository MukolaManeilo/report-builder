import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventProcessorModule } from '../core/event-processor/event-processor.module';
import { NatsListenerModule } from '../core/nats/nats-listener.module';

@Module({
  imports: [EventProcessorModule, NatsListenerModule],
  controllers: [AppController],
})
export class AppModule {}
