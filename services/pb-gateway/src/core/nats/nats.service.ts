import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { connect, JetStreamClient, NatsConnection, StringCodec } from 'nats';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private readonly sc = StringCodec();
  private readonly logger = new Logger(NatsService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const natsUrl = this.configService.get<string>('nats.url');

    try {
      this.nc = await connect({ servers: natsUrl });
      this.js = this.nc.jetstream();

      this.logger.log(`✅ Connected to NATS at ${natsUrl}`);
    } catch (error) {
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error(`❌ Failed to connect to NATS at ${natsUrl}`, stack);
    }
  }

  async publishToJetStream(subject: string, data: object): Promise<void> {
    const payload = this.sc.encode(JSON.stringify(data));
    await this.js.publish(subject, payload);
  }

  async onModuleDestroy(): Promise<void> {
    await this.nc?.drain();
    this.logger.log('🔌 Disconnected from NATS');
  }
}
