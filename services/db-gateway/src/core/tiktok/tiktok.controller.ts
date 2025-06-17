import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { TiktokEventSchema } from '@mukolamaneilo/event-types';
import { ZodError } from 'zod';

@Controller('facebook')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Post()
  async createEvent(@Body() body: unknown) {
    try {
      const parseResult = TiktokEventSchema.parse(body);
      return this.tiktokService.create(parseResult);
    } catch (error: any) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.format());
      }
      throw new InternalServerErrorException(error);
    }
  }
}
