import { Router } from "express";
import { restaurantRoutes } from "@/modules/restaurant/restaurant.routes";
import { guideRoutes } from "@/modules/guide/guide.routes";

const router = Router();

router.use("/restaurants", restaurantRoutes);
router.use("/guides", guideRoutes);

export const v1Router: Router = router;
