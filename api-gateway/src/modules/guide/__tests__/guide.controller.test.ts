import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { createGuideDetail, createGuideItemWithRestaurant } from "@shared/packages/tests";
import { GuideController } from "../guide.controller";
import { GuideService } from "../guide.service";

const createMockGuideService = () => {
    return {
        getGuides: vi.fn(),
        getGuideItemsByGuideId: vi.fn(),
    } as unknown as GuideService;
}

describe("GuideController", () => {
    let mockGuideService: GuideService;
    let controller: GuideController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let sendResponseMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockGuideService = createMockGuideService();
        controller = new GuideController(mockGuideService);
        sendResponseMock = vi.fn();
        mockNext = vi.fn();
        mockRequest = {};
        mockResponse = { sendResponse: sendResponseMock as unknown as Response['sendResponse'] };
    });

    describe("getGuides", () => {
        it("should return guides with 200 status", async () => {
            const guides = [
                createGuideDetail({ id: "guide-1" }),
                createGuideDetail({ id: "guide-2" }),
            ];

            vi.mocked(mockGuideService.getGuides).mockResolvedValue(guides);

            controller.getGuides(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(mockGuideService.getGuides).toHaveBeenCalledTimes(1);
                expect(sendResponseMock).toHaveBeenCalledWith(
                    200,
                    guides,
                    "Guides fetched successfully"
                );
            });
        });

        it("should return empty array when no guides exist", async () => {
            vi.mocked(mockGuideService.getGuides).mockResolvedValue([]);

            controller.getGuides(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(sendResponseMock).toHaveBeenCalledWith(
                    200,
                    [],
                    "Guides fetched successfully"
                );
            });
        });

        it("should send error response when service fails", async () => {
            const error = new Error("Service error");
            vi.mocked(mockGuideService.getGuides).mockRejectedValue(error);

            controller.getGuides(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(mockGuideService.getGuides).toHaveBeenCalledTimes(1);
                expect(sendResponseMock).toHaveBeenCalledWith(
                    500,
                    {},
                    "Service error"
                );
            });
        });
    });

    describe("getGuideItemsByGuideId", () => {
        it("should return guide items with 200 status for valid guideId", async () => {
            const guideItems = [
                createGuideItemWithRestaurant({ id: "item-1" }),
                createGuideItemWithRestaurant({ id: "item-2" }),
            ];

            mockRequest.params = { guideId: "550e8400-e29b-41d4-a716-446655440000" };
            vi.mocked(mockGuideService.getGuideItemsByGuideId).mockResolvedValue(guideItems);

            controller.getGuideItemsByGuideId(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(mockGuideService.getGuideItemsByGuideId).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
                expect(sendResponseMock).toHaveBeenCalledWith(
                    200,
                    guideItems,
                    "Guide items fetched successfully"
                );
            });
        });

        it("should return empty array when guide has no items", async () => {
            mockRequest.params = { guideId: "550e8400-e29b-41d4-a716-446655440000" };
            vi.mocked(mockGuideService.getGuideItemsByGuideId).mockResolvedValue([]);

            controller.getGuideItemsByGuideId(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(sendResponseMock).toHaveBeenCalledWith(
                    200,
                    [],
                    "Guide items fetched successfully"
                );
            });
        });

        it("should send error response for invalid guideId", async () => {
            mockRequest.params = { guideId: "invalid-uuid" };

            controller.getGuideItemsByGuideId(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(sendResponseMock).toHaveBeenCalledWith(
                    expect.any(Number),
                    {},
                    expect.any(String)
                );
                expect(mockGuideService.getGuideItemsByGuideId).not.toHaveBeenCalled();
            });
        });

        it("should send error response for missing guideId", async () => {
            mockRequest.params = {};

            controller.getGuideItemsByGuideId(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(sendResponseMock).toHaveBeenCalledWith(
                    expect.any(Number),
                    {},
                    expect.any(String)
                );
                expect(mockGuideService.getGuideItemsByGuideId).not.toHaveBeenCalled();
            });
        });

        it("should send error response when service fails", async () => {
            const error = new Error("Guide not found");
            mockRequest.params = { guideId: "550e8400-e29b-41d4-a716-446655440000" };
            vi.mocked(mockGuideService.getGuideItemsByGuideId).mockRejectedValue(error);

            controller.getGuideItemsByGuideId(mockRequest as Request, mockResponse as Response, mockNext);

            await vi.waitFor(() => {
                expect(mockGuideService.getGuideItemsByGuideId).toHaveBeenCalledWith("550e8400-e29b-41d4-a716-446655440000");
                expect(sendResponseMock).toHaveBeenCalledWith(
                    500,
                    {},
                    "Guide not found"
                );
            });
        });
    });
});