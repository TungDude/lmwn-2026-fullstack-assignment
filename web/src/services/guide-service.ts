import { apiClient } from "@/lib/api-client";
import type {
    GuideDetail,
    GuideItemWithRestaurant,
} from "@shared/packages/schemas";
import type { ApiResponse } from "@shared/packages/types";

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