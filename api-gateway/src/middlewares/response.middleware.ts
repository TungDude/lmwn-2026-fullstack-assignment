import { sendResponse } from '@/helpers/send-response';
import { Response, NextFunction, Request } from 'express';

export const responseFormatterMiddleware = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    res.sendResponse = <T>(
        status: number,
        data: T,
        message: string | null = null
    ) => {
        return sendResponse<T>(res, status, data, message);
    };

    next();
};