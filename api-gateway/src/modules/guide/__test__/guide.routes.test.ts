import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { guideRoutes } from "../guide.routes";
import { guideService } from "../guide.service";
import { responseFormatterMiddleware } from "@/middlewares/response.middleware";
import { createGuideDetail, createGuideItemWithRestaurant } from "./guide.fixtures";

vi.mock("../guide.service");

describe("Guide Routes", () => {
    let app: Express;

    beforeEach(() => {
        vi.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use(responseFormatterMiddleware);
        app.use("/guides", guideRoutes);
    });

    describe("GET /guides", () => {
        it("should return all guides with 200 status", async () => {
            const guides = [
                createGuideDetail({ id: "guide-1" }),
                createGuideDetail({ id: "guide-2" }),
            ];

            vi.mocked(guideService.getGuides).mockResolvedValue(guides);

            const response = await request(app).get("/guides");

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(guides);
            expect(response.body.message).toBe("Guides fetched successfully");
            expect(guideService.getGuides).toHaveBeenCalledTimes(1);
        });

        it("should return empty array when no guides exist", async () => {
            vi.mocked(guideService.getGuides).mockResolvedValue([]);

            const response = await request(app).get("/guides");

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });

        it("should return 500 when service fails", async () => {
            vi.mocked(guideService.getGuides).mockRejectedValue(new Error("Service error"));

            const response = await request(app).get("/guides");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Service error");
        });
    });

    describe("GET /guides/:guideId/items", () => {
        const validGuideId = "550e8400-e29b-41d4-a716-446655440000";

        it("should return guide items with 200 status for valid guideId", async () => {
            const guideItems = [
                createGuideItemWithRestaurant({ id: "item-1" }),
                createGuideItemWithRestaurant({ id: "item-2" }),
            ];

            vi.mocked(guideService.getGuideItemsByGuideId).mockResolvedValue(guideItems);

            const response = await request(app).get(`/guides/${validGuideId}/items`);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(guideItems);
            expect(response.body.message).toBe("Guide items fetched successfully");
            expect(guideService.getGuideItemsByGuideId).toHaveBeenCalledWith(validGuideId);
        });

        it("should return empty array when guide has no items", async () => {
            vi.mocked(guideService.getGuideItemsByGuideId).mockResolvedValue([]);

            const response = await request(app).get(`/guides/${validGuideId}/items`);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });

        it("should return 400 for invalid UUID format", async () => {
            const response = await request(app).get("/guides/invalid-uuid/items");

            expect(response.status).toBe(400);
            expect(response.body.message).toContain("Invalid uuid");
            expect(guideService.getGuideItemsByGuideId).not.toHaveBeenCalled();
        });

        it("should return 500 when service fails", async () => {
            vi.mocked(guideService.getGuideItemsByGuideId).mockRejectedValue(
                new Error("Guide not found")
            );

            const response = await request(app).get(`/guides/${validGuideId}/items`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Guide not found");
        });

        it("should handle missing guideId parameter", async () => {
            const response = await request(app).get("/guides//items");

            expect(response.status).toBe(404);
        });
    });

    describe("Route Registration", () => {
        it("should register GET /guides route", async () => {
            vi.mocked(guideService.getGuides).mockResolvedValue([]);

            const response = await request(app).get("/guides");

            expect(response.status).not.toBe(404);
        });

        it("should register GET /guides/:guideId/items route", async () => {
            const validGuideId = "550e8400-e29b-41d4-a716-446655440000";
            vi.mocked(guideService.getGuideItemsByGuideId).mockResolvedValue([]);

            const response = await request(app).get(`/guides/${validGuideId}/items`);

            expect(response.status).not.toBe(404);
        });

        it("should return 404 for non-existent routes", async () => {
            const response = await request(app).get("/guides/invalid-route");

            expect(response.status).toBe(404);
        });

        it("should not accept POST requests on GET-only routes", async () => {
            const response = await request(app).post("/guides");

            expect(response.status).toBe(404);
        });
    });
});