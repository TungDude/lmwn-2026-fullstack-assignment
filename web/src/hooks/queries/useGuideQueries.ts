import {
    useQuery,
    type UseQueryResult,
} from "@tanstack/react-query";
import { guideService } from "@/services/guide-service";
import type { GuideDetail, GuideItemWithRestaurant } from "@shared/packages/schemas";

export const guideKeys = {
    all: ["guides"] as const,
    detail: (guideId: string) => [...guideKeys.all, "details", guideId] as const,
    details: () => [...guideKeys.all, "details"] as const,
    item: (guideId: string) => [...guideKeys.all, "items", guideId] as const,
    items: () => [...guideKeys.all, "items"] as const,
};

export const useGuides = (): UseQueryResult<GuideDetail[], unknown> => {
    return useQuery<GuideDetail[]>({
        queryKey: guideKeys.details(),
        queryFn: () => guideService.getGuides(),
    });
};

export const useGuideItemsByGuideId = (
    guideId: string
): UseQueryResult<GuideItemWithRestaurant[], unknown> => {
    return useQuery<GuideItemWithRestaurant[]>({
        queryKey: guideKeys.item(guideId),
        queryFn: () => guideService.getGuideItemsByGuideId(guideId),
    });
};