import { Module } from '@nestjs/common';
import { EventProcessorService } from './event-processor.service';
import { EventProcessorController } from './event-processor.controller';

@Module({
  controllers: [EventProcessorController],
  providers: [EventProcessorService],
  exports: [EventProcessorService],
})
export class EventProcessorModule {}
