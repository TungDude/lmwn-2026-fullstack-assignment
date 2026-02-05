import { Request, Response } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { GuideIdSchema } from "@shared/packages";
import { GuideService, guideService } from "./guide.service";

export class GuideController {
    constructor(private readonly guideService: GuideService) {}

    getGuides = asyncHandler(async (_: Request, res: Response) => {
        const guides = await this.guideService.getGuides();
        res.sendResponse(200, guides, "Guides fetched successfully");
    });

    getGuideItemsByGuideId = asyncHandler(async (req: Request, res: Response) => {
        const { guideId } = GuideIdSchema.parse(req.params);

        const guideItems = await this.guideService.getGuideItemsByGuideId(guideId);
        res.sendResponse(200, guideItems, "Guide items fetched successfully");
    });
}

export const guideController = new GuideController(guideService);