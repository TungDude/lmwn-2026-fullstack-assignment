import { Request, Response } from "express";
import { asyncHandler } from "@/helpers/async-handler";

export const healthCheck = asyncHandler(async(_: Request, res: Response) => {
    res.sendResponse(200, { status: "online" }, "Service is healthy");
});