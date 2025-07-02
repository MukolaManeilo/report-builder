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
    if (!this.js) {
      this.logger.error(`❌ JetStream not connected for "${subject}"`);
      return;
    }
    try {
      await Promise.race([
        this.js.publish(subject, this.sc.encode(JSON.stringify(data))),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      // this.logger.error(
      //   `❌ Failed to publish "${subject}": ${error instanceof Error ? error.message : error}`,
      // );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.nc?.drain();
    this.logger.log('🔌 Disconnected from NATS');
  }
}
