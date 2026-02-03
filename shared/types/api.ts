export type ApiResponse<T> = {
    success: boolean;
    message: string | null;
    data: T;
    timestamp: string;
}

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}