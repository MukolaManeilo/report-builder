import { Controller, Post, RawBodyRequest, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';
import { pipeline } from 'stream/promises';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { Transform } from 'stream';

interface Message {
  value: {
    source: string;
  };
}

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async createMessages(@Req() rawBody: RawBodyRequest<Request>, @Res() res: Response): Promise<void> {
    const messageProcessor = new Transform({
      objectMode: true,
      transform(chunk: Message, _enc, callback): void {
        this.push(chunk);
        callback();
      },
    });

    messageProcessor.on('data', (message: Message) => {
      const topic = message.value.source;
      if (!topic || !this.webhookService.isTopicValid(topic)) {
        console.warn(`Invalid topic: ${topic}`);
        return;
      }
      this.webhookService.createMessage(topic, message.value).catch((error) => {
        console.error('Failed to send message:', error);
      });
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
