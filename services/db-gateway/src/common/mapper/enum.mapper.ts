import { Gender } from '@prisma/client';

export const genderMap = {
  toDb: {
    male: Gender.male,
    female: Gender.female,
    'non-binary': Gender.non_binary,
  },
  fromDb: {
    [Gender.male]: 'male',
    [Gender.female]: 'female',
    [Gender.non_binary]: 'non-binary',
  },
} as const;

export const facebookEventTypeMap = {
  toDb: {
    'ad.view': 'ad_view',
    'page.like': 'page_like',
    comment: 'comment',
    'video.view': 'video_view',
    'ad.click': 'ad_click',
    'form.submission': 'form_submission',
    'checkout.complete': 'checkout_complete',
  },
  fromDb: {
    ad_view: 'ad.view',
    page_like: 'page.like',
    comment: 'comment',
    video_view: 'video.view',
    ad_click: 'ad.click',
    form_submission: 'form.submission',
    checkout_complete: 'checkout.complete',
  },
} as const;

export const tiktokEventTypeMap = {
  toDb: {
    'video.view': 'video_view',
    like: 'like',
    share: 'share',
    comment: 'comment',
    'profile.visit': 'profile_visit',
    purchase: 'purchase',
    follow: 'follow',
  },
  fromDb: {
    video_view: 'video.view',
    like: 'like',
    share: 'share',
    comment: 'comment',
    profile_visit: 'profile.visit',
    purchase: 'purchase',
    follow: 'follow',
  },
} as const;
