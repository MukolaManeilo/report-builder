import { Controller, Post, RawBodyRequest, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { pipeline } from 'stream/promises';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { Transform } from 'stream';
import { Event, EventSchema } from '@mukolamaneilo/event-types';
import { ZodError } from 'zod';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async createMessages(@Req() rawBody: RawBodyRequest<Request>, @Res() res: Response): Promise<void> {
    const messageProcessor = new Transform({
      objectMode: true,
      transform(chunk: Event, _enc, callback): void {
        this.push(chunk);
        callback();
      },
    });

    messageProcessor.on('data', (message: unknown) => {
      try {
        const validMessage: Event = EventSchema.parse(message);
        this.webhookService.createMessage(validMessage).catch((err: Error) => rethrow(err.message));
      } catch (error) {
        if (error instanceof ZodError) {
          console.warn('Validation failed:', error.errors);
        } else {
          console.error('Unknown error:', error);
        }
      }
    });

    messageProcessor.on('error', (err) => {
      console.error('Stream processing error:', err);
      if (!res.headersSent) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid JSON' });
      }
    });

    try {
      await pipeline(rawBody, parser(), streamArray(), messageProcessor);

      if (!res.headersSent) {
        console.log('Messages processed successfully');
        res
          .status(HttpStatus.CREATED)
          .json({ statusCode: HttpStatus.CREATED, message: 'All messages processed successfully' });
      }
    } catch (err) {
      console.error('Pipeline error:', err);
      if (!res.headersSent) {
        throw new HttpException('Failed to process JSON body', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
