import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';
import { ReportsService } from './reports.service';
import {
  RevenueFilterSchema,
  DemographicsFacebookSchema,
  DemographicsTiktokSchema,
  RevenueFilter,
  FacebookEventsFilterSchema,
  TiktokEventsFilterSchema,
} from '@mukolamaneilo/event-filters';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('events')
  async getEvents(@Query() query: unknown) {
    try {
      if (FacebookEventsFilterSchema.safeParse(query).success) {
        const filter = FacebookEventsFilterSchema.parse(query);
        return this.reportsService.getEventsReport(filter);
      } else if (TiktokEventsFilterSchema.safeParse(query).success) {
        const filter = TiktokEventsFilterSchema.parse(query);
        return this.reportsService.getEventsReport(filter);
      } else {
        throw new BadRequestException('Query does not match any schema');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException(err.errors);
      }
      throw err;
    }
  }

  @Get('revenue')
  async getRevenue(@Query() query: unknown) {
    try {
      const filter: RevenueFilter = RevenueFilterSchema.parse(query);
      return this.reportsService.getRevenueReport(filter);
    } catch (err) {
      if (err instanceof ZodError) throw new BadRequestException(err.errors);
      throw err;
    }
  }

  @Get('demographics')
  async getDemographics(@Query() query: unknown) {
    try {
      if (DemographicsFacebookSchema.safeParse(query).success) {
        const filter = DemographicsFacebookSchema.parse(query);
        return this.reportsService.getDemographics(filter);
      } else if (DemographicsTiktokSchema.safeParse(query).success) {
        const filter = DemographicsTiktokSchema.parse(query);
        return this.reportsService.getDemographics(filter);
      } else {
        throw new BadRequestException('Query does not match any schema');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException(err.errors);
      }
      throw err;
    }
  }
}
