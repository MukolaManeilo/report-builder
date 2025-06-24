import { Module } from '@nestjs/common';
import { EventHandlerModule } from '../event-handler/event-handler.module';
import { NatsListenerService } from './nats-listener.service';

@Module({
  imports: [EventHandlerModule],
  providers: [NatsListenerService],
  exports: [NatsListenerService],
})
export class NatsListenerModule {}
