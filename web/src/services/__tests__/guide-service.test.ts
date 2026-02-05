import { describe, it, expect, vi, beforeEach } from "vitest";
import { guideService } from "../guide-service";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@shared/packages/types";
import type { GuideDetail, GuideItemWithRestaurant } from "@shared/packages/schemas";
import {
    createGuideDetail,
    createGuideItemWithRestaurant,
} from "@shared/packages/tests";

vi.mock("@/lib/api-client");

describe("guideService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getGuides", () => {
        it("should fetch and return guides", async () => {
            const mockGuides = [
                createGuideDetail({ id: "guide-1" }),
                createGuideDetail({ id: "guide-2" }),
            ];

            const mockResponse: ApiResponse<GuideDetail[]> = {
                success: true,
                message: "Guides fetched successfully",
                data: mockGuides,
                timestamp: new Date().toISOString(),
            };

            vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

            const result = await guideService.getGuides();

            expect(apiClient.get).toHaveBeenCalledWith("/guides");
            expect(result).toEqual(mockGuides);
        });

        it("should return empty array when no guides exist", async () => {
            const mockResponse: ApiResponse<GuideDetail[]> = {
                success: true,
                message: "Guides fetched successfully",
                data: [],
                timestamp: new Date().toISOString(),
            };

            vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

            const result = await guideService.getGuides();

            expect(result).toEqual([]);
        });

        it("should throw error when API call fails", async () => {
            const error = new Error("Network error");
            vi.mocked(apiClient.get).mockRejectedValue(error);

            await expect(guideService.getGuides()).rejects.toThrow("Network error");
            expect(apiClient.get).toHaveBeenCalledWith("/guides");
        });
    });

    describe("getGuideItemsByGuideId", () => {
        const guideId = "550e8400-e29b-41d4-a716-446655440000";

        it("should fetch and return guide items with restaurants", async () => {
            const mockGuideItems = [
                createGuideItemWithRestaurant({ id: "item-1" }),
                createGuideItemWithRestaurant({ id: "item-2", restaurantId: "rest-2" }),
            ];

            const mockResponse: ApiResponse<GuideItemWithRestaurant[]> = {
                success: true,
                message: "Guide items fetched successfully",
                data: mockGuideItems,
                timestamp: new Date().toISOString(),
            };

            vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

            const result = await guideService.getGuideItemsByGuideId(guideId);

            expect(apiClient.get).toHaveBeenCalledWith(`/guides/${guideId}/items`);
            expect(result).toEqual(mockGuideItems);
        });

        it("should return empty array when guide has no items", async () => {
            const mockResponse: ApiResponse<GuideItemWithRestaurant[]> = {
                success: true,
                message: "Guide items fetched successfully",
                data: [],
                timestamp: new Date().toISOString(),
            };

            vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

            const result = await guideService.getGuideItemsByGuideId(guideId);

            expect(result).toEqual([]);
        });

        it("should throw error when API call fails", async () => {
            const error = new Error("Guide not found");
            vi.mocked(apiClient.get).mockRejectedValue(error);

            await expect(guideService.getGuideItemsByGuideId(guideId)).rejects.toThrow("Guide not found");
            expect(apiClient.get).toHaveBeenCalledWith(`/guides/${guideId}/items`);
        });

        it("should handle guide items without restaurant data", async () => {
            const mockGuideItems = [
                {
                    id: "item-1",
                    restaurantId: "rest-1",
                    restaurant: undefined,
                } as GuideItemWithRestaurant,
            ];

            const mockResponse: ApiResponse<GuideItemWithRestaurant[]> = {
                success: true,
                message: "Guide items fetched successfully",
                data: mockGuideItems,
                timestamp: new Date().toISOString(),
            };

            vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

            const result = await guideService.getGuideItemsByGuideId(guideId);

            expect(result).toEqual(mockGuideItems);
            expect(result[0].restaurant).toBeUndefined();
        });
    });
});