import { Controller } from '@nestjs/common';
import { EventProcessorService } from './event-processor.service';
import { Event } from '@mukolamaneilo/event-types';

@Controller('event-processor')
export class EventProcessorController {
  constructor(private readonly eventProcessorService: EventProcessorService) {}
}
