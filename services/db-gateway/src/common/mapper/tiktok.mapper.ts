import {
  TiktokEvent,
  TiktokUser,
  TiktokEngagement,
  TiktokEngagementTop,
  TiktokEngagementBottom,
} from '@mukolamaneilo/event-types';
import { Prisma, DeviceTiktok, FunnelStage, TiktokEventType } from '@prisma/client';
import { tiktokEventTypeMap } from './enum.mapper';

export class TiktokMapper {
  static fromDb(
    event: Prisma.TiktokEventGetPayload<{
      include: {
        user: true;
        engagementTop: true;
        engagementBottom: true;
      };
    }>,
  ): TiktokEvent {
    const isTop = !!event.engagementTop;

    const engagement: TiktokEngagement = isTop
      ? {
          watchTime: event.engagementTop!.watchTime,
          percentageWatched: event.engagementTop!.percentageWatched,
          device: event.engagementTop!.device,
          country: event.engagementTop!.country,
          videoId: event.engagementTop!.videoId,
        }
      : {
          actionTime: event.engagementBottom!.actionTime.toISOString(),
          profileId: event.engagementBottom!.profileId ?? null,
          purchasedItem: event.engagementBottom!.purchasedItem ?? null,
          purchaseAmount: event.engagementBottom!.purchaseAmount ?? null,
        };

    const user: TiktokUser = {
      userId: event.user.userId,
      username: event.user.username,
      followers: event.user.followers,
    };

    return {
      eventId: event.eventId,
      timestamp: event.timestamp.toISOString(),
      source: 'tiktok',
      funnelStage: event.funnelStage,
      eventType: tiktokEventTypeMap.fromDb[event.eventType],
      data: {
        user,
        engagement,
      },
    };
  }

  static toDbUser(user: TiktokUser): Prisma.TiktokUserCreateInput {
    return {
      userId: user.userId,
      username: user.username,
      followers: user.followers,
    };
  }

  static toDbEngagementTop(engagement: TiktokEngagementTop): Prisma.TiktokEngagementTopCreateInput {
    return {
      watchTime: engagement.watchTime,
      percentageWatched: engagement.percentageWatched,
      device: engagement.device as DeviceTiktok,
      country: engagement.country,
      videoId: engagement.videoId,
    };
  }

  static toDbEngagementBottom(engagement: TiktokEngagementBottom) {
    return {
      actionTime: new Date(typeof engagement.actionTime),
      profileId: engagement.profileId ?? null,
      purchasedItem: engagement.purchasedItem ?? null,
      purchaseAmount: engagement.purchaseAmount ?? null,
    };
  }

  static toDbEvent(
    event: TiktokEvent,
    userId: number,
    engagementTopId?: number,
    engagementBottomId?: number,
  ) {
    return {
      eventId: event.eventId,
      timestamp: new Date(event.timestamp),
      source: 'tiktok' as const,
      funnelStage: event.funnelStage as FunnelStage,
      eventType: tiktokEventTypeMap.toDb[event.eventType] as TiktokEventType,
      userId,
      engagementTopId,
      engagementBottomId,
    };
  }
}
