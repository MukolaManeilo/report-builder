import { Injectable } from '@nestjs/common';
import { TiktokEvent } from '@mukolamaneilo/event-types';
import { PrismaService } from '../prisma/prisma.service';
import { tiktokEventTypeMap } from '../../common/utils/enum-convert';

@Injectable()
export class TiktokService {
  constructor(private prisma: PrismaService) {}

  async create(event: TiktokEvent): Promise<number> {
    let user = await this.prisma.tiktokUser.findUnique({
      where: { userId: event.data.user.userId },
    });

    if (!user) {
      user = await this.prisma.tiktokUser.create({
        data: {
          userId: event.data.user.userId,
          username: event.data.user.username,
          followers: event.data.user.followers,
        },
      });
    } else {
      await this.prisma.tiktokUser.update({
        where: { id: user.id },
        data: {
          username: event.data.user.username,
          followers: event.data.user.followers,
        },
      });
    }

    let engagementTopId: number | undefined;
    let engagementBottomId: number | undefined;

    if ('watchTime' in event.data.engagement) {
      engagementTopId = (
        await this.prisma.tiktokEngagementTop.create({
          data: {
            watchTime: event.data.engagement.watchTime,
            percentageWatched: event.data.engagement.percentageWatched,
            device: event.data.engagement.device,
            country: event.data.engagement.country,
            videoId: event.data.engagement.videoId,
          },
        })
      ).id;
    } else {
      engagementBottomId = (
        await this.prisma.tiktokEngagementBottom.create({
          data: {
            actionTime: new Date(event.data.engagement.actionTime),
            profileId: event.data.engagement.profileId ?? null,
            purchasedItem: event.data.engagement.purchasedItem ?? null,
            purchaseAmount: event.data.engagement.purchaseAmount ?? null,
          },
        })
      ).id;
    }

    const createdEvent = await this.prisma.tiktokEvent.create({
      data: {
        eventId: event.eventId,
        timestamp: new Date(event.timestamp),
        source: 'tiktok',
        funnelStage: event.funnelStage,
        eventType: tiktokEventTypeMap.toDb[event.eventType],
        userId: user.id,
        engagementTopId,
        engagementBottomId,
      },
    });
    return createdEvent.id;
  }
}
