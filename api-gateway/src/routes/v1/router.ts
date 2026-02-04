import { Router } from "express";
import { guideRoutes } from "@/modules/guide/guide.routes";

const router = Router();

router.use("/guides", guideRoutes);

export const v1Router: Router = router;
