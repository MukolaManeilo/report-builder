import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookEventSchema } from '@mukolamaneilo/event-types';
import { ZodError } from 'zod';

@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Post()
  async createEvent(@Body() body: unknown) {
    try {
      const parseResult = FacebookEventSchema.parse(body);
      return this.facebookService.create(parseResult);
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.format());
      }
      throw new InternalServerErrorException(error);
    }
  }
}
