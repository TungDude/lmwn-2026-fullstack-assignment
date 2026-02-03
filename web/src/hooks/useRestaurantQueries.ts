import {
    useQuery,
    type UseQueryResult,
} from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant-service";
import type { Restaurant } from "@shared/packages";

export const restaurantKeys = {
    all: ["restaurants"] as const,
    detail: (restaurantId: string) => [...restaurantKeys.all, "details", restaurantId] as const,
    details: () => [...restaurantKeys.all, "details"] as const,
};

export const useRestaurantById = (
    restaurantId: string,
): UseQueryResult<Restaurant, unknown> => {
    return useQuery<Restaurant>({
        queryKey: restaurantKeys.detail(restaurantId),
        queryFn: () => restaurantService.getRestaurantById(restaurantId),
        enabled: Boolean(restaurantId),
    });
};