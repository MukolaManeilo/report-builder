import { z } from 'zod';


export const FunnelStageSchema = z.enum(["top", "bottom"]);
export type FunnelStage = z.infer<typeof FunnelStageSchema>;

export const SourcesSchema = z.enum(["facebook", "tiktok"]);
export type Sources = z.infer<typeof SourcesSchema>;

// facebook types
export const FacebookTopEventTypeSchema = z.enum(["ad.view", "page.like", "comment", "video.view"]);
export type FacebookTopEventType = z.infer<typeof FacebookTopEventTypeSchema>;
export const FacebookBottomEventTypeSchema = z.enum(["ad.click", "form.submission", "checkout.complete"]);
export type FacebookBottomEventType = z.infer<typeof FacebookBottomEventTypeSchema>;
export const FacebookEventTypeSchema = z.union([FacebookTopEventTypeSchema, FacebookBottomEventTypeSchema]);
export type FacebookEventType = z.infer<typeof FacebookEventTypeSchema>;
export const GenderSchema = z.enum(["male", "female", "non-binary"]);
export type Gender = z.infer<typeof GenderSchema>;

export const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});
export type FacebookUserLocation = z.infer<typeof FacebookUserLocationSchema>;

export const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: GenderSchema,
  location: FacebookUserLocationSchema,
});
export type FacebookUser = z.infer<typeof FacebookUserSchema>;


export const ReferrerSchema = z.enum(["newsfeed", "marketplace", "groups"]);
export type Referrer = z.infer<typeof ReferrerSchema>;

export const FacebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: ReferrerSchema,
  videoId: z.string().nullable(),
});
export type FacebookEngagementTop = z.infer<typeof FacebookEngagementTopSchema>;

export const ClickPositionSchema = z.enum(["top_left", "bottom_right", "center"]);
export type ClickPosition = z.infer<typeof ClickPositionSchema>;

export const FacebookEngagementBottomDeviceSchema = z.enum(["mobile", "desktop"]);
export type Device = z.infer<typeof FacebookEngagementBottomDeviceSchema>;

export const BrowserSchema = z.enum(["Chrome", "Firefox", "Safari"]);
export type Browser = z.infer<typeof BrowserSchema>;

export const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: ClickPositionSchema,
  device: FacebookEngagementBottomDeviceSchema,
  browser: BrowserSchema,
  purchaseAmount: z.string().nullable(),
});
export type FacebookEngagementBottom = z.infer<typeof FacebookEngagementBottomSchema>;

export const FacebookEngagementSchema = z.union([
  FacebookEngagementTopSchema,
  FacebookEngagementBottomSchema,
]);
export type FacebookEngagement = z.infer<typeof FacebookEngagementSchema>;

export const FacebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("facebook"),
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});
export type FacebookEvent = z.infer<typeof FacebookEventSchema>;

//tiktok types:

export const TiktokTopEventTypeSchema = z.enum(["video.view", "like", "share", "comment"]);
export type TiktokTopEventType = z.infer<typeof TiktokTopEventTypeSchema>;
export const TiktokBottomEventTypeSchema = z.enum(["profile.visit", "purchase", "follow"]);
export type TiktokBottomEventType = z.infer<typeof TiktokBottomEventTypeSchema>;
export const TiktokEventTypeSchema = z.union([TiktokTopEventTypeSchema, TiktokBottomEventTypeSchema]);
export type TiktokEventType = z.infer<typeof TiktokEventTypeSchema>;


export const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});
export type TiktokUser = z.infer<typeof TiktokUserSchema>;

export const TiktokEngagementTopDeviceSchema = z.enum(["Android", "iOS", "Desktop"]);
export type TiktokEngagementTopDevice = z.infer<typeof TiktokEngagementTopDeviceSchema>;


export const TiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: TiktokEngagementTopDeviceSchema,
  country: z.string(),
  videoId: z.string(),
});
export type TiktokEngagementTop= z.infer<typeof TiktokEngagementTopSchema>;

export const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});
export type TiktokEngagementBottom = z.infer<typeof TiktokEngagementBottomSchema>;

export const TiktokEngagementSchema = z.union([
  TiktokEngagementTopSchema,
  TiktokEngagementBottomSchema,
]);
export type TiktokEngagement = z.infer<typeof TiktokEngagementSchema>;

export const TiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("tiktok"),
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventTypeSchema,
  data: z.object({
    user: TiktokUserSchema,
    engagement: TiktokEngagementSchema,
  }),
});

export type TiktokEvent = z.infer<typeof TiktokEventSchema>;

export const EventSchema = z.union([FacebookEventSchema, TiktokEventSchema]);

export type Event = z.infer<typeof EventSchema>;
