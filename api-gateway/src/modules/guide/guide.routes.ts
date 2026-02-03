import { Router } from "express";
import * as guideController from "./guide.controller";

const router = Router();

router.get("/", guideController.getGuides);
router.get("/:guideId", guideController.getGuideDetailById);
router.get("/items/:guideItemId", guideController.getGuideItemById);

export const guideRoutes: Router = router;