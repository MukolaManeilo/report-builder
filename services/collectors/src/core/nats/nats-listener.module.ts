import { Module } from '@nestjs/common';
import { EventProcessorModule } from '../event-processor/event-processor.module';
import { NatsListenerService } from './nats-listener.service';

@Module({
  imports: [EventProcessorModule],
  providers: [NatsListenerService],
  exports: [NatsListenerService],
})
export class NatsListenerModule {}
