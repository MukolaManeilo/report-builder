import { Injectable } from '@nestjs/common';
import { FacebookEvent } from '@mukolamaneilo/event-types';
import { PrismaService } from '../prisma/prisma.service';
import { facebookEventTypeMap, genderMap } from '../../common/utils/enum-convert';

@Injectable()
export class FacebookService {
  constructor(private prisma: PrismaService) {}

  async create(event: FacebookEvent): Promise<number> {
    let location = await this.prisma.facebookUserLocation.findFirst({
      where: {
        country: event.data.user.location.country,
        city: event.data.user.location.city,
      },
    });

    if (!location) {
      location = await this.prisma.facebookUserLocation.create({
        data: {
          country: event.data.user.location.country,
          city: event.data.user.location.city,
        },
      });
    }

    let user = await this.prisma.facebookUser.findUnique({
      where: { userId: event.data.user.userId },
    });

    const dbGender = genderMap.toDB[event.data.user.gender];

    if (!user) {
      user = await this.prisma.facebookUser.create({
        data: {
          userId: event.data.user.userId,
          name: event.data.user.name,
          age: event.data.user.age,
          gender: dbGender,
          locationId: location.id,
        },
      });
    } else {
      await this.prisma.facebookUser.update({
        where: { id: user.id },
        data: {
          name: event.data.user.name,
          age: event.data.user.age,
          gender: dbGender,
          locationId: location.id,
        },
      });
    }

    let engagementTopId: number | undefined;
    let engagementBottomId: number | undefined;

    if ('actionTime' in event.data.engagement) {
      engagementTopId = (
        await this.prisma.facebookEngagementTop.create({
          data: {
            actionTime: new Date(event.data.engagement.actionTime),
            referrer: event.data.engagement.referrer,
            videoId: event.data.engagement.videoId ?? null,
          },
        })
      ).id;
    } else {
      // bottom engagement
      engagementBottomId = (
        await this.prisma.facebookEngagementBottom.create({
          data: {
            adId: event.data.engagement.adId,
            campaignId: event.data.engagement.campaignId,
            clickPosition: event.data.engagement.clickPosition,
            device: event.data.engagement.device,
            browser: event.data.engagement.browser,
            purchaseAmount: event.data.engagement.purchaseAmount ?? null,
          },
        })
      ).id;
    }

    const createdEvent = await this.prisma.facebookEvent.create({
      data: {
        eventId: event.eventId,
        timestamp: new Date(event.timestamp),
        source: 'facebook',
        funnelStage: event.funnelStage,
        eventType: facebookEventTypeMap.toDb[event.eventType],
        userId: user.id,
        engagementTopId,
        engagementBottomId,
      },
    });

    return createdEvent.id;
  }
}
