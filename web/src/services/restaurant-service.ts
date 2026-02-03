import { apiClient } from "@/lib/api-client";
import type {
    ApiResponse,
    Restaurant,
} from "@shared/packages";

export const restaurantService = {
    async getRestaurantById(restaurantId: string): Promise<Restaurant> {
        const response = await apiClient.get<ApiResponse<Restaurant>>(
            `/restaurants/${restaurantId}`,
        );
        return response.data.data;
    },
};