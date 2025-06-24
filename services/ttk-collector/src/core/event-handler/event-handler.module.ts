import { Module } from '@nestjs/common';
import { EventHandlerService } from './event-handler.service';

@Module({
  providers: [EventHandlerService],
  exports: [EventHandlerService],
})
export class EventHandlerModule {}
