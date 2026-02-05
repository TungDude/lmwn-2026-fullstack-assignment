import type {
    GuideDetail,
    GuideItem,
    Restaurant,
    GuideItemWithRestaurant,
} from "@shared/packages";

export const createGuideDetail = (overrides?: Partial<GuideDetail>): GuideDetail => ({
    id: "guide-1",
    title: "Sample Guide",
    socialTitle: "Sample Social Title",
    shortDescription: "This is a short description.",
    description: "This is a detailed description of the guide.",
    coverPhoto: {
        id: "photo-1",
        smallUrl: "https://example.com/small.jpg",
        largeUrl: "https://example.com/large.jpg",
    },
    tags: ["tag1", "tag2"],
    writeDate: "2023-01-01",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
    items: ["item-1", "item-2"],
    ...overrides,
});

export const createGuideItem = (overrides?: Partial<GuideItem>): GuideItem => ({
    id: "item-1",
    restaurantId: "rest-1",
    description: "This is a guide item description.",
    photos: [
        {
            id: "photo-2",
            smallUrl: "https://example.com/item-small.jpg",
            largeUrl: "https://example.com/item-large.jpg",
        }
    ],
    ...overrides,
});

export const createRestaurant = (overrides?: Partial<Restaurant>): Restaurant => ({
    id: "rest-1",
    name: "Sample Restaurant",
    rating: 4.5,
    numberOfReviews: 150,
    url: "https://example.com/restaurant",
    address: "123 Sample St, Sample City",
    lat: 12.345678,
    lng: 98.765432,
    phoneNo: "123-456-7890",
    categories: ["Category1", "Category2"],
    workingHours: [
        { day: 1, open: "09:00", close: "21:00" },
        { day: 2, open: "09:00", close: "21:00" },
    ],
    official: true,
    delivery: true,
    pickup: true,
    ...overrides,
});

export const createGuideItemWithRestaurant = (overrides?: Partial<GuideItemWithRestaurant>): GuideItemWithRestaurant => ({
    ...createGuideItem(),
    restaurant: createRestaurant(),
    ...overrides,
});