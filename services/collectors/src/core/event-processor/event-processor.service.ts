import { Injectable, Logger } from '@nestjs/common';
import { EventSchema, Event } from '@mukolamaneilo/event-types';

@Injectable()
export class EventProcessorService {
  private readonly logger = new Logger(EventProcessorService.name);

  processEvent(eventData: unknown): void {
    try {
      const event: Event = EventSchema.parse(eventData);

      //await this.saveEventToDb(event);
      this.logger.log(`Event ${event.eventId} processed and saved`);
    } catch (error) {
      this.logger.error('Failed to validate or save event', error);
    }
  }
}
