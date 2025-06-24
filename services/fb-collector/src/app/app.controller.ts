import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  healthCheck(): object {
    console.log('Health Check');
    return { status: 'ok' };
  }
}
