import { Router } from "express";
import * as restaurantController from "./restaurant.controller";

const router = Router();

router.get("/:restaurantId", restaurantController.getRestaurantById);

export const restaurantRoutes: Router = router;