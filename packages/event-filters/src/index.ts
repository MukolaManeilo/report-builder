import { z } from 'zod';
import {
  FunnelStageSchema,
  SourcesSchema,
  GenderSchema,
  TiktokEngagementTopDeviceSchema, TiktokEventTypeSchema, FacebookEventTypeSchema,
} from '@mukolamaneilo/event-types';

export const DemographicsFacebookSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  source: z.literal("facebook"),
  age: z.number().int().min(0).optional(),
  gender: GenderSchema.optional(),
  location: z.string().optional(),
});

export const DemographicsTiktokSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  source: z.literal("tiktok"),
  followers: z.number().int().min(0).optional(),
  country: z.string().optional(),
  device: TiktokEngagementTopDeviceSchema.optional(),
});


export const FacebookEventsFilterSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  source: z.literal("facebook"),
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
});

export const TiktokEventsFilterSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  source: z.literal("tiktok"),
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventTypeSchema,
});

export const RevenueFilterSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  source: SourcesSchema,
  campaignId: z.string().optional(),
});
export type DemographicsFacebook = z.infer<typeof DemographicsFacebookSchema>;
export type DemographicsTiktok = z.infer<typeof DemographicsTiktokSchema>;
export type TiktokEventsFilter = z.infer<typeof TiktokEventsFilterSchema>;
export type FacebookEventsFilter = z.infer<typeof FacebookEventsFilterSchema>;
export type RevenueFilter = z.infer<typeof RevenueFilterSchema>;
