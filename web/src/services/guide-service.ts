import { apiClient } from "@/lib/api-client";
import type {
    ApiResponse,
    GuideDetail,
    GuideItemWithRestaurant,
} from "@shared/packages";

export const guideService = {
    async getGuides(): Promise<GuideDetail[]> {
        const response = await apiClient.get<ApiResponse<GuideDetail[]>>(
            `/guides`,
        );
        return response.data.data;
    },

    async getGuideItemsByGuideId(guideId: string): Promise<GuideItemWithRestaurant[]> {
        const response = await apiClient.get<ApiResponse<GuideItemWithRestaurant[]>>(
            `/guides/${guideId}/items`,
        );
        return response.data.data;
    },
};