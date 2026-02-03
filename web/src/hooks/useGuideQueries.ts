import {
    useQuery,
    type UseQueryResult,
} from "@tanstack/react-query";
import { guideService } from "@/services/guide-service";
import type { GuideDetail, GuideItem } from "@shared/packages";

export const guideKeys = {
    all: ["guides"] as const,
    detail: (guideId: string) => [...guideKeys.all, "details", guideId] as const,
    details: () => [...guideKeys.all, "details"] as const,
    item: (guideItemId: string) => [...guideKeys.all, "items", guideItemId] as const,
    items: () => [...guideKeys.all, "items"] as const,
};

export const useGuides = (): UseQueryResult<GuideDetail[], unknown> => {
    return useQuery<GuideDetail[]>({
        queryKey: guideKeys.details(),
        queryFn: () => guideService.getGuides(),
    });
};

export const useGuideById = (
    guideId: string,
): UseQueryResult<GuideDetail, unknown> => {
    return useQuery<GuideDetail>({
        queryKey: guideKeys.detail(guideId),
        queryFn: () => guideService.getGuideById(guideId),
        enabled: Boolean(guideId),
    });
};

export const useGuideItemById = (
    guideItemId: string,
): UseQueryResult<GuideItem, unknown> => {
    return useQuery<GuideItem>({
        queryKey: guideKeys.item(guideItemId),
        queryFn: () => guideService.getGuideItemById(guideItemId),
        enabled: Boolean(guideItemId),
    });
};