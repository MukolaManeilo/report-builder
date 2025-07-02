import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { connect, StringCodec, NatsConnection, Subscription } from 'nats';
import { EventHandlerService } from '../event-handler/event-handler.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NatsListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NatsListenerService.name);
  private nc?: NatsConnection;
  private sub?: Subscription;

  constructor(
    private readonly eventHandlerService: EventHandlerService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const natsUrl = this.configService.get<string>('nats.url');
    if (!natsUrl) {
      this.logger.error('❌ NATS URL is not configured!');
      return;
    }

    try {
      this.nc = await connect({ servers: [natsUrl] });
      const sc = StringCodec();
      this.sub = this.nc.subscribe('facebook');
      this.logger.log(`✅ Subscribed to topic "facebook" at ${natsUrl}`);

      void this.processMessages(sc);
    } catch (error: unknown) {
      this.logger.error(
        `❌ Failed to connect to NATS at ${natsUrl}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  private async processMessages(sc: ReturnType<typeof StringCodec>) {
    if (!this.sub) {
      this.logger.error('❌ No subscription available for processing messages');
      return;
    }

    for await (const msg of this.sub) {
      try {
        const data: unknown = JSON.parse(sc.decode(msg.data));
        await this.eventHandlerService.eventHandler(data);
      } catch (err: unknown) {
        this.logger.error('❌ Failed to process message', err instanceof Error ? err.stack : String(err));
      }
    }
  }

  async onModuleDestroy() {
    if (this.nc) {
      await this.nc.drain();
      this.logger.log('🔌 Disconnected from NATS');
    }
  }
}
