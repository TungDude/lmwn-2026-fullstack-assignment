import { QueryClient } from "@tanstack/react-query";
import { config } from "@/app/config/env";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: config.defaultQueryStaleTime,
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
                if (error && typeof error === "object" && "response" in error) {
                    const axiosError = error as { response?: { status?: number } };
                    if (
                        axiosError.response?.status &&
                        axiosError.response.status >= 400 &&
                        axiosError.response.status < 500
                    ) {
                        return false;
                    }
                }
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: false,
        },
    },
});