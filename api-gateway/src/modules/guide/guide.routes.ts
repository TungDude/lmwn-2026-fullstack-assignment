import { Router } from "express";
import * as guideController from "./guide.controller";

const router = Router();

router.get("/", guideController.getGuides);
router.get("/:guideId/items", guideController.getGuideItemsByGuideId);

export const guideRoutes: Router = router;