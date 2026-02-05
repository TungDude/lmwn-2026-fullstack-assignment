import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AxiosInstance } from "axios";
import { GuideService } from "../guide.service";
import type {
    GuideDetail,
    GuideItem,
    Restaurant,
    GuideItemWithRestaurant,
} from "@shared/packages/schemas";
import { createGuideDetail, createGuideItem, createRestaurant } from "@shared/packages/tests";

function createMockAxios() {
    const get = vi.fn();

    return {
        get,
    } as unknown as AxiosInstance;
}

describe("GuideService", () => {
    let guideHttpClient: AxiosInstance;
    let restaurantHttpClient: AxiosInstance;
    let service: GuideService;

    beforeEach(() => {
        guideHttpClient = createMockAxios();
        restaurantHttpClient = createMockAxios();
        service = new GuideService(guideHttpClient, restaurantHttpClient);
    });

    describe("getGuides", () => {
        it("should fetch and return sorted guides", async () => {
            const guideIds = ["guide1", "guide2"];
            const guideDetails: GuideDetail[] = [
                createGuideDetail({ id: "guide1", createdAt: "2023-01-01T00:00:00Z" }),
                createGuideDetail({ id: "guide2", createdAt: "2023-02-01T00:00:00Z" }),
            ];

            vi.mocked(guideHttpClient.get)
                .mockResolvedValueOnce({ data: guideIds })
                .mockResolvedValueOnce({ data: guideDetails[0] })
                .mockResolvedValueOnce({ data: guideDetails[1] });

            const result = await service.getGuides();

            expect(guideHttpClient.get).toHaveBeenCalledWith("/guides");
            expect(guideHttpClient.get).toHaveBeenCalledWith("/guides/guide1");
            expect(guideHttpClient.get).toHaveBeenCalledWith("/guides/guide2");
            expect(result).toEqual([guideDetails[1], guideDetails[0]]);
        });

        it("should return empty array when no guides exist", async () => {
            vi.mocked(guideHttpClient.get).mockResolvedValueOnce({ data: [] });

            const result = await service.getGuides();

            expect(guideHttpClient.get).toHaveBeenCalledWith("/guides");
            expect(result).toEqual([]);
        });

        it("should handle single guide", async () => {
            const guideIds = ["guide1"];
            const guide = createGuideDetail({ id: "guide1" });

            vi.mocked(guideHttpClient.get)
                .mockResolvedValueOnce({ data: guideIds })
                .mockResolvedValueOnce({ data: guide });

            const result = await service.getGuides();

            expect(result).toEqual([guide]);
        });

        it("should handle empty guide id request", async () => {
            vi.mocked(guideHttpClient.get).mockResolvedValueOnce({ data: [] });

            const result = await service.getGuides();

            expect(result).toEqual([]);
        });
    });

    describe("getGuideItemsByGuideId", () => {
        it("should fetch and return guide items with restaurant details", async () => {
            const guide = createGuideDetail({ id: "guide-1", items: ["item-1", "item-2"] });

            const items: GuideItem[] = [
                createGuideItem({ id: "item-1", restaurantId: "rest-1" }),
                createGuideItem({ id: "item-2", restaurantId: "rest-2" }),
            ];

            const restaurants: Restaurant[] = [
                createRestaurant({ id: "rest-1", name: "Pizza Place" }),
                createRestaurant({ id: "rest-2", name: "Sushi Bar" }),
            ];

            vi.mocked(guideHttpClient.get)
                .mockResolvedValueOnce({ data: guide })
                .mockResolvedValueOnce({ data: items[0] })
                .mockResolvedValueOnce({ data: items[1] });

            vi.mocked(restaurantHttpClient.get)
                .mockResolvedValueOnce({ data: restaurants[0] })
                .mockResolvedValueOnce({ data: restaurants[1] });

            const result = await service.getGuideItemsByGuideId("guide-1");

            expect(guideHttpClient.get).toHaveBeenCalledWith("/guides/guide-1");
            expect(guideHttpClient.get).toHaveBeenCalledWith("/guide-items/item-1");
            expect(guideHttpClient.get).toHaveBeenCalledWith("/guide-items/item-2");
            expect(restaurantHttpClient.get).toHaveBeenCalledWith("/restaurants/rest-1");
            expect(restaurantHttpClient.get).toHaveBeenCalledWith("/restaurants/rest-2");
            expect({ ...items[0], restaurant: restaurants[0] } as GuideItemWithRestaurant).toBeDefined();
            expect({ ...items[1], restaurant: restaurants[1] } as GuideItemWithRestaurant).toBeDefined();
            expect(result).toEqual([
                { ...items[0], restaurant: restaurants[0] },
                { ...items[1], restaurant: restaurants[1] },
            ]);
        });

        it("should handle guide with no items", async () => {
            const guide = createGuideDetail({ id: "guide-1", items: [] });

            vi.mocked(guideHttpClient.get).mockResolvedValueOnce({ data: guide });

            const result = await service.getGuideItemsByGuideId("guide-1");

            expect(result).toEqual([]);
            expect(restaurantHttpClient.get).not.toHaveBeenCalled();
        });

        it("should handle undefined items array", async () => {
            const guide = createGuideDetail({ id: "guide-1", items: undefined });

            vi.mocked(guideHttpClient.get).mockResolvedValueOnce({ data: guide });

            const result = await service.getGuideItemsByGuideId("guide-1");

            expect(result).toEqual([]);
        });

        it("should deduplicate restaurant requests when items share same restaurant", async () => {
            const guide = createGuideDetail({ id: "guide-1", items: ["item-1", "item-2"] });
            const items: GuideItem[] = [
                createGuideItem({ id: "item-1", restaurantId: "rest-1" }),
                createGuideItem({ id: "item-2", restaurantId: "rest-1" }),
            ];
            const restaurant = createRestaurant({ id: "rest-1" });

            vi.mocked(guideHttpClient.get)
                .mockResolvedValueOnce({ data: guide })
                .mockResolvedValueOnce({ data: items[0] })
                .mockResolvedValueOnce({ data: items[1] });

            vi.mocked(restaurantHttpClient.get).mockResolvedValueOnce({ data: restaurant });

            const result = await service.getGuideItemsByGuideId("guide-1");

            expect(restaurantHttpClient.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { ...items[0], restaurant },
                { ...items[1], restaurant },
            ]);
        });

        it("should handle guide item with restaurant id but restaurant not found", async () => {
            const guide = createGuideDetail({ id: "guide-1", items: ["item-1"] });
            const item = createGuideItem({ id: "item-1", restaurantId: "rest-999" });

            vi.mocked(guideHttpClient.get)
                .mockResolvedValueOnce({ data: guide })
                .mockResolvedValueOnce({ data: item });

            vi.mocked(restaurantHttpClient.get).mockRejectedValueOnce({
                response: { status: 404 }
            });

            const result = await service.getGuideItemsByGuideId("guide-1");

            expect(restaurantHttpClient.get).toHaveBeenCalledWith("/restaurants/rest-999");
            expect(result).toEqual([{ ...item, restaurant: undefined }]);
        });
    });
});