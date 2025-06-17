import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, JetStreamClient, NatsConnection, StringCodec } from 'nats';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private readonly sc = StringCodec();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const natsUrl = this.configService.get<string>('nats.url');
      this.nc = await connect({ servers: natsUrl });
      this.js = this.nc.jetstream();
      console.log(`✅ Connected to NATS at ${natsUrl}`);
    } catch (error) {
      console.error('Error connecting to NATS:', error);
    }
  }

  async publishToJetStream(subject: string, data: object): Promise<void> {
    const payload = this.sc.encode(JSON.stringify(data));
    console.log('Topic: ' + subject);
    await this.js.publish(subject, payload);
  }

  async onModuleDestroy(): Promise<void> {
    await this.nc?.drain();
  }
}
