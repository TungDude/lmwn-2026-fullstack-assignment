import { Request, Response } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { GuideIdSchema, GuideItemIdSchema } from "@shared/packages";
import { guideService } from "./guide.service";

export const getGuides = asyncHandler(async (_: Request, res: Response) => {
    const guides = await guideService.getGuides();
    res.sendResponse(200, guides, "Guides fetched successfully");
});

export const getGuideDetailById = asyncHandler(async (req: Request, res: Response) => {
    const { guideId } = GuideIdSchema.parse(req.params);

    const guideDetail = await guideService.getGuideDetailById(guideId);
    res.sendResponse(200, guideDetail, "Guide detail fetched successfully");
});

export const getGuideItemById = asyncHandler(async (req: Request, res: Response) => {
    const { guideItemId } = GuideItemIdSchema.parse(req.params);

    const guideItem = await guideService.getGuideItemById(guideItemId);
    res.sendResponse(200, guideItem, "Guide item fetched successfully");
});