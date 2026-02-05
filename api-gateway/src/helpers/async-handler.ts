import { Request, Response, NextFunction } from 'express';
import { ZodError } from '@shared/packages';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            const status = error instanceof ZodError ? 400 : error.status || 500;
            const message = error.message || "Internal Server Error";
            res.sendResponse(status, {}, message);
        });
    };
};