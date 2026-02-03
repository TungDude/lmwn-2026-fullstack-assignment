declare global {
    namespace Express {
        export interface Response {
            sendResponse<T>(status: number, data: T, message?: string | null): Response;
        }
    }
}

export {};