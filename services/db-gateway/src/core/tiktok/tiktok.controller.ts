import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { TiktokEventSchema, TiktokEvent } from '@mukolamaneilo/event-types';
import { ZodError } from 'zod';

@Controller('events/tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Post()
  async create(@Body() body: TiktokEvent): Promise<{ id: number }> {
    try {
      const parsed = TiktokEventSchema.parse(body);
      const id = await this.tiktokService.create(parsed);
      return { id };
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation failed:', error.format());
        throw new BadRequestException('Invalid Tiktok event data');
      } else {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }
}
