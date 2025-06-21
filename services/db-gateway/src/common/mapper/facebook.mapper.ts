import {
  FacebookUser,
  FacebookEngagement,
  FacebookEngagementTop,
  FacebookEngagementBottom,
  FacebookEvent,
} from '@mukolamaneilo/event-types';
import {
  Gender,
  Referrer,
  ClickPosition,
  DeviceFacebook,
  Browser,
  FacebookEventType,
  Prisma,
  FunnelStage,
} from '@prisma/client';
import { facebookEventTypeMap, genderMap } from './enum.mapper';

export class FacebookMapper {
  static fromDb(
    event: Prisma.FacebookEventGetPayload<{
      include: {
        user: { include: { location: true } };
        engagementTop: true;
        engagementBottom: true;
      };
    }>,
  ): FacebookEvent {
    const isTop = !!event.engagementTop;

    const engagement: FacebookEngagement = isTop
      ? {
          actionTime: event.engagementTop!.actionTime.toISOString(),
          referrer: event.engagementTop!.referrer,
          videoId: event.engagementTop!.videoId ?? null,
        }
      : {
          adId: event.engagementBottom!.adId,
          campaignId: event.engagementBottom!.campaignId,
          clickPosition: event.engagementBottom!.clickPosition,
          device: event.engagementBottom!.device,
          browser: event.engagementBottom!.browser,
          purchaseAmount: event.engagementBottom!.purchaseAmount ?? null,
        };

    const user: FacebookUser = {
      userId: event.user.userId,
      name: event.user.name,
      age: event.user.age,
      gender: genderMap.fromDb[event.user.gender],
      location: {
        city: event.user.location.city,
        country: event.user.location.country,
      },
    };

    return {
      eventId: event.eventId,
      timestamp: event.timestamp.toISOString(),
      source: 'facebook',
      funnelStage: event.funnelStage,
      eventType: facebookEventTypeMap.fromDb[event.eventType],
      data: {
        user,
        engagement,
      },
    };
  }

  static toDbUser(user: FacebookUser, locationId: number): Prisma.FacebookUserCreateInput {
    return {
      userId: user.userId,
      name: user.name,
      age: user.age,
      gender: genderMap.toDb[user.gender] as Gender,
      location: {
        connect: {
          id: locationId,
        },
      },
    };
  }

  static toDbEngagementTop(engagement: FacebookEngagementTop) {
    return {
      actionTime: new Date(engagement.actionTime),
      referrer: engagement.referrer as Referrer,
      videoId: engagement.videoId ?? null,
    };
  }

  static toDbEngagementBottom(engagement: FacebookEngagementBottom) {
    return {
      adId: engagement.adId,
      campaignId: engagement.campaignId,
      clickPosition: engagement.clickPosition as ClickPosition,
      device: engagement.device as DeviceFacebook,
      browser: engagement.browser as Browser,
      purchaseAmount: engagement.purchaseAmount ?? null,
    };
  }

  static toDbEvent(
    event: FacebookEvent,
    userId: number,
    engagementTopId?: number,
    engagementBottomId?: number,
  ) {
    return {
      eventId: event.eventId,
      timestamp: new Date(event.timestamp),
      source: 'facebook' as const,
      funnelStage: event.funnelStage as FunnelStage,
      eventType: facebookEventTypeMap.toDb[event.eventType] as FacebookEventType,
      userId,
      engagementTopId,
      engagementBottomId,
    };
  }
}
