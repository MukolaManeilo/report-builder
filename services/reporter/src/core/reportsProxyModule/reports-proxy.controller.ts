import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('reports')
export class ReportsProxyController {
  private readonly dbGatewayUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.dbGatewayUrl = this.configService.getOrThrow<string>('dbGateway.url');
  }

  @Get('events')
  async getEvents(@Query() query: Record<string, unknown>): Promise<unknown> {
    return this.forward('/reports/events', query);
  }

  @Get('revenue')
  async getRevenue(@Query() query: Record<string, unknown>): Promise<unknown> {
    return this.forward('/reports/revenue', query);
  }

  @Get('demographics')
  async getDemographics(@Query() query: Record<string, unknown>): Promise<unknown> {
    return this.forward('/reports/demographics', query);
  }

  private async forward<T>(path: string, query: Record<string, unknown>): Promise<T> {
    const url = `${this.dbGatewayUrl}${path}`;
    const response$ = this.httpService.get<T>(url, {
      params: query as Record<string, any>,
    });
    const response = await firstValueFrom(response$);
    return response.data;
  }
}
