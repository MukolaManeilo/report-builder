import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';
import { Event } from '@mukolamaneilo/event-types';

@Injectable()
export class WebhookService {
  constructor(private readonly natsService: NatsService) {}

  async createMessage(body: Event): Promise<void> {
    await this.natsService.publishToJetStream(body.source, body);
  }
}
