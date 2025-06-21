import { Injectable } from '@nestjs/common';
import { FacebookRepository } from './facebook.repository';
import { FacebookMapper } from '../../common/mapper/facebook.mapper';
import { FacebookEvent } from '@mukolamaneilo/event-types';
import { DemographicsFacebook, FacebookEventsFilter, RevenueFilter } from '@mukolamaneilo/event-filters';
import { facebookEventTypeMap, genderMap } from '../../common/mapper/enum.mapper';

@Injectable()
export class FacebookService {
  constructor(private readonly repository: FacebookRepository) {}

  async create(newEventDto: FacebookEvent): Promise<number> {
    const { user, engagement } = newEventDto.data;

    // Location
    let location = await this.repository.findLocation(user.location.city, user.location.country);
    if (!location) {
      location = await this.repository.createLocation(user.location.city, user.location.country);
    }

    // User
    let dbUser = await this.repository.findUserByUserId(user.userId);

    if (!dbUser) {
      const newDbUser = FacebookMapper.toDbUser(user, location.id);
      dbUser = await this.repository.createUser(newDbUser);
    } else {
      const updatedUser = FacebookMapper.toDbUser(user, location.id);
      await this.repository.updateUser(dbUser.id, updatedUser);
    }

    // Engagement
    let engagementTopId: number | undefined;
    let engagementBottomId: number | undefined;

    if ('actionTime' in engagement) {
      const engagementTop = FacebookMapper.toDbEngagementTop(engagement);
      const top = await this.repository.createEngagementTop(engagementTop);
      engagementTopId = top.id;
    } else {
      const engagementBottom = FacebookMapper.toDbEngagementBottom(engagement);
      const bottom = await this.repository.createEngagementBottom(engagementBottom);
      engagementBottomId = bottom.id;
    }

    // Event
    const newEvent = FacebookMapper.toDbEvent(newEventDto, dbUser.id, engagementTopId, engagementBottomId);
    const created = await this.repository.createEvent(newEvent);

    return created.id;
  }

  async getAggregatedEvents(filter: FacebookEventsFilter) {
    const results = await this.repository.aggregateEvents({
      from: new Date(filter.from),
      to: new Date(filter.to),
      funnelStage: filter.funnelStage,
      eventType: facebookEventTypeMap.toDb[filter.eventType],
    });

    return results.map((res) => ({
      eventType: facebookEventTypeMap.fromDb[res.eventType],
      funnelStage: res.funnelStage,
      count: res._count._all,
    }));
  }

  async getAggregatedRevenue(filter: RevenueFilter) {
    const { from, to, campaignId } = filter;

    return this.repository.aggregateRevenue({
      from,
      to,
      campaignId: campaignId ?? '',
    });
  }

  async getAggregatedDemographics(filter: DemographicsFacebook) {
    const results = await this.repository.aggregatedDemographics({
      from: new Date(filter.from),
      to: new Date(filter.to),
      age: filter.age,
      gender: filter.gender ? genderMap.toDb[filter.gender] : undefined,
      location: filter.location
        ? {
            OR: [{ city: filter.location }, { country: filter.location }],
          }
        : undefined,
    });

    return results.map((res) => ({
      ...res,
      gender: genderMap.fromDb[res.gender],
    }));
  }
}
