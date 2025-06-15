import { Injectable } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';

@Injectable()
export class WebhookService {
  private allowedTopics = ['tiktok', 'facebook'];

  constructor(private readonly natsService: NatsService) {}
  isTopicValid(topic: string): boolean {
    return this.allowedTopics.includes(topic);
  }

  async createMessage(topic: string, body: object): Promise<void> {
    await this.natsService.publishToJetStream(topic, body);
  }
}
