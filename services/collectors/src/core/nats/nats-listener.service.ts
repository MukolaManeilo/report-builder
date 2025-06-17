import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, StringCodec } from 'nats';
import { EventProcessorService } from '../event-processor/event-processor.service';

@Injectable()
export class NatsListenerService implements OnModuleInit {
  constructor(private readonly eventProcessor: EventProcessorService) {}

  async onModuleInit() {
    const nc = await connect({ servers: ['nats://localhost:4222'] });
    const sc = StringCodec();

    const sub = nc.subscribe('tiktok');
    console.log(`🟢 Subscribed to topic: "tiktok"`);

    for await (const msg of sub) {
      try {
        const data: unknown = JSON.parse(sc.decode(msg.data));
        this.eventProcessor.processEvent(data);
      } catch (err) {
        console.error('❌ Failed to process message:', err);
      }
    }
  }
}
