import { Request, Response } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { GuideIdSchema } from "@shared/packages";
import { guideService } from "./guide.service";

export const getGuides = asyncHandler(async (_: Request, res: Response) => {
    const guides = await guideService.getGuides();
    res.sendResponse(200, guides, "Guides fetched successfully");
});

export const getGuideItemsByGuideId = asyncHandler(async (req: Request, res: Response) => {
    const { guideId } = GuideIdSchema.parse(req.params);

    const guideItems = await guideService.getGuideItemsByGuideId(guideId);
    res.sendResponse(200, guideItems, "Guide items fetched successfully");
});