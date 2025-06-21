import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, TiktokEventType, FunnelStage, DeviceTiktok } from '@prisma/client';

@Injectable()
export class TiktokRepository {
  constructor(private prisma: PrismaService) {}

  // USER
  async findUserByUserId(userId: string) {
    return this.prisma.tiktokUser.findUnique({
      where: { userId },
    });
  }

  async createUser(data: { userId: string; username: string; followers: number }) {
    return this.prisma.tiktokUser.create({ data });
  }

  async updateUser(userId: number, data: Partial<Omit<Prisma.TiktokUserUpdateInput, 'userId'>>) {
    return this.prisma.tiktokUser.update({
      where: { id: userId },
      data,
    });
  }

  // ENGAGEMENT
  async createEngagementTop(data: {
    watchTime: number;
    percentageWatched: number;
    device: DeviceTiktok;
    country: string;
    videoId: string;
  }) {
    return this.prisma.tiktokEngagementTop.create({ data });
  }

  async createEngagementBottom(data: {
    actionTime: Date;
    profileId?: string | null;
    purchasedItem?: string | null;
    purchaseAmount?: string | null;
  }) {
    return this.prisma.tiktokEngagementBottom.create({ data });
  }

  // EVENT
  async createEvent(data: {
    eventId: string;
    timestamp: Date;
    source: 'tiktok';
    funnelStage: FunnelStage;
    eventType: TiktokEventType;
    userId: number;
    engagementTopId?: number;
    engagementBottomId?: number;
  }) {
    return this.prisma.tiktokEvent.create({ data });
  }

  async aggregateEvents(filter: {
    from: string;
    to: string;
    funnelStage: FunnelStage;
    eventType: TiktokEventType;
  }) {
    const { from, to, funnelStage, eventType } = filter;

    return this.prisma.tiktokEvent.groupBy({
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

  async aggregateRevenue(filter: { from: string; to: string }) {
    const { from, to } = filter;

    return this.prisma.tiktokEvent.findMany({
      where: {
        timestamp: {
          gte: new Date(from),
          lte: new Date(to),
        },
        eventType: 'purchase',
      },
      select: {
        engagementBottom: {
          select: {
            purchaseAmount: true,
          },
        },
      },
    });
  }

  async aggregatedDemographics(filter: {
    from: Date;
    to: Date;
    followers?: number;
    country?: string;
    device?: DeviceTiktok;
  }) {
    return this.prisma.tiktokUser.groupBy({
      by: ['followers'],
      where: {
        tiktokEvents: {
          some: {
            timestamp: {
              gte: filter.from,
              lte: filter.to,
            },
            ...(filter.device && {
              engagementTop: {
                device: filter.device,
              },
            }),
          },
        },
        ...(filter.followers !== undefined && {
          followers: filter.followers,
        }),
        ...(filter.country && {
          tiktokEvents: {
            some: {
              engagementTop: {
                country: filter.country,
              },
            },
          },
        }),
      },
      _count: {
        _all: true,
      },
      _avg: {
        followers: true,
      },
    });
  }
}
