import { Injectable } from '@nestjs/common';
import {
  TiktokEventsFilter,
  FacebookEventsFilter,
  RevenueFilter,
  DemographicsFacebook,
  DemographicsTiktok,
} from '@mukolamaneilo/event-filters';
import { FacebookService } from '../facebook/facebook.service';
import { TiktokService } from '../tiktok/tiktok.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly tiktokService: TiktokService,
  ) {}

  async getEventsReport(filter: FacebookEventsFilter | TiktokEventsFilter) {
    if (filter.source === 'facebook') {
      return this.facebookService.getAggregatedEvents(filter);
    } else {
      return this.tiktokService.getAggregatedEvents(filter);
    }
  }

  async getRevenueReport(filter: RevenueFilter) {
    if (filter.source === 'facebook') {
      return this.facebookService.getAggregatedRevenue(filter);
    } else {
      return this.tiktokService.getAggregatedRevenue(filter);
    }
  }

  async getDemographics(filter: DemographicsFacebook | DemographicsTiktok) {
    if (filter.source === 'facebook') {
      return this.facebookService.getAggregatedDemographics(filter);
    } else {
      return this.tiktokService.getAggregatedDemographics(filter);
    }
  }
}
