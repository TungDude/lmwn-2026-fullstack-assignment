import { z } from 'zod';
import { Restaurant } from './restaurant';

export const GuideDetailSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    socialTitle: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    coverPhoto: z.object({
        id: z.string().uuid(),
        smallUrl: z.string().url(),
        largeUrl: z.string().url(),
    }),
    tags: z.array(z.string()),
    writeDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    items: z.array(z.string().uuid()),
});

export type GuideDetail = z.infer<typeof GuideDetailSchema>;

export const GuideItemSchema = z.object({
    id: z.string().uuid(),
    description: z.string(),
    restaurantId: z.string().uuid(),
    photos: z.array(z.object({
        id: z.string().uuid(),
        smallUrl: z.string().url(),
        largeUrl: z.string().url(),
    })),
});

export type GuideItem = z.infer<typeof GuideItemSchema>;

export const GuideIdSchema = z.object({
    guideId: z.string().uuid(),
});

export type GuideId = z.infer<typeof GuideIdSchema>;

export const GuideItemIdSchema = z.object({
    guideItemId: z.string().uuid(),
});

export type GuideItemId = z.infer<typeof GuideItemIdSchema>;

export type GuideItemWithRestaurant = GuideItem & { restaurant?: Restaurant };