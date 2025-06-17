import { z } from 'zod';


const FunnelStageSchema = z.enum(["top", "bottom"]);

// facebook types
 const FacebookTopEventType = z.enum(["ad.view", "page.like", "comment", "video.view"]);
 const FacebookBottomEventType = z.enum(["ad.click", "form.submission", "checkout.complete"]);
 const FacebookEventType = z.union([FacebookTopEventType, FacebookBottomEventType]);

 const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

 const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female", "non-binary"]),
  location: FacebookUserLocationSchema,
});

 const FacebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(["newsfeed", "marketplace", "groups"]),
  videoId: z.string().nullable(),
});

 const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(["top_left", "bottom_right", "center"]),
  device: z.enum(["mobile", "desktop"]),
  browser: z.enum(["Chrome", "Firefox", "Safari"]),
  purchaseAmount: z.string().nullable(),
});

 const FacebookEngagementSchema = z.union([
  FacebookEngagementTopSchema,
  FacebookEngagementBottomSchema,
]);

export const FacebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("facebook"),
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventType,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});

export type FacebookEvent = z.infer<typeof FacebookEventSchema>;

//tiktok types:
 const TiktokTopEventType = z.enum(["video.view", "like", "share", "comment"]);
 const TiktokBottomEventType = z.enum(["profile.visit", "purchase", "follow"]);
 const TiktokEventType = z.union([TiktokTopEventType, TiktokBottomEventType]);

 const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});

 const TiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.enum(["Android", "iOS", "Desktop"]),
  country: z.string(),
  videoId: z.string(),
});

 const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

 const TiktokEngagementSchema = z.union([
  TiktokEngagementTopSchema,
  TiktokEngagementBottomSchema,
]);

export const TiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("tiktok"),
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventType,
  data: z.object({
    user: TiktokUserSchema,
    engagement: TiktokEngagementSchema,
  }),
});

export type TiktokEvent = z.infer<typeof TiktokEventSchema>;

export const EventSchema = z.union([FacebookEventSchema, TiktokEventSchema]);

export type Event = z.infer<typeof EventSchema>;
