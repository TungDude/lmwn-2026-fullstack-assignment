import { Router } from "express";
import { v1Router } from "@/routes/v1/router";
import { healthRoutes } from "@/modules/health/health.routes";

const router = Router();

router.use("/v1", v1Router);
router.use("/health", healthRoutes);

export const appRouter: Router = router;