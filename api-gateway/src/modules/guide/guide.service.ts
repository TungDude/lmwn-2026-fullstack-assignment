import guideClient from "@/http/guide-client";
import restaurantClient from "@/http/restaurant-client";
import type { GuideDetail, GuideItem, GuideItemWithRestaurant, Restaurant } from "@shared/packages/schemas";
import { AxiosInstance } from "axios";

export class GuideService {
    constructor(
        private readonly guideHttpClient: AxiosInstance = guideClient,
        private readonly restaurantHttpClient: AxiosInstance = restaurantClient
    ) { }

    async getGuides(): Promise<GuideDetail[]> {
        const idsResponse = await this.guideHttpClient.get<string[]>(`/guides`);
        const guideIds = idsResponse.data;

        const guidePromises = guideIds.map(id =>
            this.guideHttpClient.get<GuideDetail>(`/guides/${id}`)
        );

        const guideResponses = await Promise.all(guidePromises);
        return guideResponses.map(response => response.data).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    async getGuideItemsByGuideId(guideId: string): Promise<GuideItemWithRestaurant[]> {
        const guideResponse = await this.guideHttpClient.get<GuideDetail>(`/guides/${guideId}`);
        const guideItems = guideResponse.data.items || [];

        const guideItemPromises = guideItems.map(itemId =>
            this.guideHttpClient.get<GuideItem>(`/guide-items/${itemId}`)
        );

        const guideItemResponses = await Promise.all(guideItemPromises);
        const items = guideItemResponses.map(response => response.data);

        const restaurantIds = [...new Set(items.map(item => item.restaurantId))];
        const restaurantPromises = restaurantIds.map(id =>
            this.restaurantHttpClient.get<Restaurant>(`/restaurants/${id}`)
                .catch(() => ({ data: undefined }))
        );
        const restaurantResponses = await Promise.all(restaurantPromises);
        const restaurantsMap = new Map(
            restaurantResponses
                .filter(r => r.data !== undefined)
                .map(r => [r.data.id, r.data])
        );

        return items.map(item => ({
            ...item,
            restaurant: restaurantsMap.get(item.restaurantId)
        }));
    }
}

export const guideService = new GuideService();