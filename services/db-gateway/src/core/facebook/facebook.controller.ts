import { Controller, Post, Body, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookEventSchema, FacebookEvent } from '@mukolamaneilo/event-types';
import { ZodError } from 'zod';

@Controller('events/facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Post()
  async create(@Body() body: FacebookEvent): Promise<{ id: number }> {
    try {
      const parsed = FacebookEventSchema.parse(body);
      const id = await this.facebookService.create(parsed);
      return { id };
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation failed:', error.format());
        throw new BadRequestException('Invalid Facebook event data');
      } else {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }
}
