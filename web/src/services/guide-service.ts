import { apiClient } from "@/lib/api-client";
import type {
    ApiResponse,
    GuideDetail,
    GuideItem,
} from "@shared/packages";

export const guideService = {
    async getGuides(): Promise<GuideDetail[]> {
        const response = await apiClient.get<ApiResponse<GuideDetail[]>>(
            `/guides`,
        );
        return response.data.data;
    },

    async getGuideById(guideId: string): Promise<GuideDetail> {
        const response = await apiClient.get<ApiResponse<GuideDetail>>(
            `/guides/${guideId}`,
        );
        return response.data.data;
    },

    async getGuideItemById(guideItemId: string): Promise<GuideItem> {
        const response = await apiClient.get<ApiResponse<GuideItem>>(
            `/guides/items/${guideItemId}`,
        );
        return response.data.data;
    },
};