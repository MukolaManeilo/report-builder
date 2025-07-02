import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FacebookEventSchema, FacebookEvent } from '@mukolamaneilo/event-types';

@Injectable()
export class EventHandlerService {
  private readonly logger = new Logger(EventHandlerService.name);
  private readonly dbGatewayUrl: string;

  constructor(private configService: ConfigService) {
    this.dbGatewayUrl = this.configService.get<string>('dbGateway.url')!;
  }

  async eventHandler(eventData: unknown): Promise<void> {
    try {
      const event: FacebookEvent = FacebookEventSchema.parse(eventData);

      await this.saveEventToDb(event);
    } catch (error) {
      this.logger.error('Failed to validate or save event', error);
    }
  }

  async saveEventToDb(event: FacebookEvent): Promise<void> {
    const url = `${this.dbGatewayUrl}/events/facebook`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!res.ok) throw new Error(`Failed to save event: ${res.status}`);
  }
}
