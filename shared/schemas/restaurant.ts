import { z } from 'zod';

export const RestaurantSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    branch: z.string().optional(),
    rating: z.number().min(0).max(5),
    numberOfReviews: z.number().min(0),
    url: z.string().url(),
    address: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    phoneNo: z.string(),
    categories: z.array(z.string()),
    line: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    workingHours: z.array(z.object({
        day: z.number().min(1).max(7),
        open: z.string().regex(/^\d{1,2}:\d{2}$/),
        close: z.string().regex(/^\d{1,2}:\d{2}$/),
    })),
    official: z.boolean(),
    delivery: z.boolean(),
    pickup: z.boolean(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;