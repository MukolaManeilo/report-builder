import { Injectable } from '@nestjs/common';
import { TiktokRepository } from './tiktok.repository';
import { TiktokMapper } from '../../common/mapper/tiktok.mapper';
import { TiktokEvent, FunnelStage, TiktokEventType } from '@mukolamaneilo/event-types';
import { tiktokEventTypeMap } from '../../common/mapper/enum.mapper';
import { DemographicsTiktok, RevenueFilter } from '@mukolamaneilo/event-filters';

@Injectable()
export class TiktokService {
  constructor(private readonly repository: TiktokRepository) {}

  async create(newEventDto: TiktokEvent): Promise<number> {
    const { user, engagement } = newEventDto.data;

    // User
    let dbUser = await this.repository.findUserByUserId(user.userId);

    if (!dbUser) {
      const newUser = TiktokMapper.toDbUser(user);
      dbUser = await this.repository.createUser(newUser);
    } else {
      await this.repository.updateUser(dbUser.id, user);
    }

    // Engagement
    let engagementTopId: number | undefined;
    let engagementBottomId: number | undefined;

    if ('watchTime' in engagement) {
      const engagementTop = TiktokMapper.toDbEngagementTop(engagement);
      const created = await this.repository.createEngagementTop(engagementTop);
      engagementTopId = created.id;
    } else {
      const engagementBottom = TiktokMapper.toDbEngagementBottom(engagement);
      const created = await this.repository.createEngagementBottom(engagementBottom);
      engagementBottomId = created.id;
    }

    // Event
    const newEvent = TiktokMapper.toDbEvent(newEventDto, dbUser.id, engagementTopId, engagementBottomId);
    const createdEvent = await this.repository.createEvent(newEvent);

    return createdEvent.id;
  }

  async getAggregatedEvents(filter: {
    from: string;
    to: string;
    funnelStage: FunnelStage;
    eventType: TiktokEventType;
  }) {
    const results = await this.repository.aggregateEvents({
      from: filter.from,
      to: filter.to,
      funnelStage: filter.funnelStage,
      eventType: tiktokEventTypeMap.toDb[filter.eventType],
    });

    return results.map((res) => ({
      eventType: tiktokEventTypeMap.fromDb[res.eventType],
      funnelStage: res.funnelStage,
      count: res._count._all,
    }));
  }

  async getAggregatedRevenue(filter: RevenueFilter) {
    const { from, to } = filter;

    return this.repository.aggregateRevenue({
      from,
      to,
    });
  }

  async getAggregatedDemographics(filter: DemographicsTiktok) {
    const results = await this.repository.aggregatedDemographics({
      from: new Date(filter.from),
      to: new Date(filter.to),
      followers: filter.followers,
      country: filter.country,
      device: filter.device,
    });

    return results.map((res) => ({
      followers: res.followers,
      count: res._count._all,
      avgFollowers: res._avg?.followers ?? null,
    }));
  }
}
