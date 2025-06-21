import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Prisma,
  Gender,
  ClickPosition,
  FunnelStage,
  Referrer,
  DeviceFacebook,
  Browser,
  FacebookEventType,
} from '@prisma/client';

@Injectable()
export class FacebookRepository {
  constructor(private prisma: PrismaService) {}

  // USER LOCATION
  async findLocation(city: string, country: string) {
    return this.prisma.facebookUserLocation.findFirst({
      where: { city, country },
    });
  }

  async createLocation(city: string, country: string) {
    return this.prisma.facebookUserLocation.create({
      data: { city, country },
    });
  }

  // USER
  async findUserByUserId(userId: string) {
    return this.prisma.facebookUser.findUnique({
      where: { userId },
    });
  }

  async createUser(data: {
    userId: string;
    name: string;
    age: number;
    gender: Gender;
    location: Prisma.FacebookUserLocationCreateNestedOneWithoutUsersInput;
  }) {
    return this.prisma.facebookUser.create({ data });
  }

  async updateUser(userId: number, data: Partial<Omit<Prisma.FacebookUserCreateInput, 'userId'>>) {
    return this.prisma.facebookUser.update({
      where: { id: userId },
      data,
    });
  }

  // ENGAGEMENT
  async createEngagementTop(data: { actionTime: Date; referrer: Referrer; videoId?: string | null }) {
    return this.prisma.facebookEngagementTop.create({ data });
  }

  async createEngagementBottom(data: {
    adId: string;
    campaignId: string;
    clickPosition: ClickPosition;
    device: DeviceFacebook;
    browser: Browser;
    purchaseAmount?: string | null | undefined;
  }) {
    return this.prisma.facebookEngagementBottom.create({ data });
  }

  // EVENT
  async createEvent(data: {
    eventId: string;
    timestamp: Date;
    source: 'facebook';
    funnelStage: FunnelStage;
    eventType: FacebookEventType;
    userId: number;
    engagementTopId?: number;
    engagementBottomId?: number;
  }) {
    return this.prisma.facebookEvent.create({ data });
  }

  async aggregateEvents(filter: {
    from: Date;
    to: Date;
    funnelStage: FunnelStage;
    eventType: FacebookEventType;
  }) {
    const { from, to, funnelStage, eventType } = filter;

    return this.prisma.facebookEvent.groupBy({
      by: ['eventType', 'funnelStage'],
      where: {
        timestamp: {
          gte: new Date(from),
          lte: new Date(to),
        },
        funnelStage,
        eventType,
      },
      _count: {
        _all: true,
      },
    });
  }

  async aggregateRevenue(filter: { from: string; to: string; campaignId?: string }) {
    const { from, to, campaignId } = filter;

    return this.prisma.facebookEvent.findMany({
      where: {
        timestamp: {
          gte: from,
          lte: to,
        },
        ...(campaignId && {
          engagementBottom: {
            campaignId,
          },
        }),
        eventType: 'checkout_complete',
      },
      select: {
        engagementBottom: {
          select: {
            purchaseAmount: true,
            campaignId: true,
          },
        },
      },
    });
  }

  async aggregatedDemographics(filter: {
    from: Date;
    to: Date;
    age?: number;
    gender?: Gender;
    location?: Prisma.FacebookUserLocationWhereInput;
  }) {
    return this.prisma.facebookUser.groupBy({
      by: ['age', 'gender', 'locationId'],
      where: {
        age: filter.age,
        gender: filter.gender,
        location: filter.location,
        facebookEvents: {
          some: {
            timestamp: {
              gte: filter.from,
              lte: filter.to,
            },
          },
        },
      },
      _count: {
        _all: true,
      },
    });
  }
}
