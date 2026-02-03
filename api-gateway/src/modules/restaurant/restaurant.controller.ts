import { Request, Response } from "express";
import { asyncHandler } from "@/helpers/async-handler";
import { RestaurantIdSchema } from "@shared/packages";
import { restaurantService } from "../restaurant/restaurant.service";

export const getRestaurantById = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = RestaurantIdSchema.parse(req.params);

    const restaurant = await restaurantService.getRestaurantById(restaurantId);
    res.sendResponse(200, restaurant, "Restaurant fetched successfully");
});